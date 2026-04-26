import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { db } from "@/lib/firebaseAdmin";

function isBotUserAgent(userAgent: string) {
  return /bot|crawler|spider|preview|facebookexternalhit|twitterbot|discordbot|slackbot|kakaotalk-scrap|telegrambot|whatsapp|line/i.test(
    userAgent
  );
}

export async function POST(req: Request) {
  try {
    if (isBotUserAgent(req.headers.get("user-agent") || "")) {
      return NextResponse.json({ success: true, ok: true, ignored: true });
    }

    const { shareId } = (await req.json().catch(() => ({}))) as {
      shareId?: unknown;
    };

    if (typeof shareId !== "string" || !shareId.trim()) {
      return NextResponse.json({ error: "No shareId" }, { status: 400 });
    }

    const result = await db.runTransaction(async (tx) => {
      const shareRef = db.collection("shareReports").doc(shareId.trim());
      const shareSnap = await tx.get(shareRef);

      if (!shareSnap.exists) {
        return "not_found" as const;
      }

      const data = shareSnap.data();

      if (!data) {
        return "not_found" as const;
      }

      if (data.unlocked === true || data.clicked === true) {
        return "already_unlocked" as const;
      }

      const ownerUid = data.ownerUid;
      const reportId = data.reportId;

      if (typeof ownerUid !== "string" || typeof reportId !== "string") {
        return "invalid" as const;
      }

      const now = FieldValue.serverTimestamp();
      const userRef = db.collection("users").doc(ownerUid);
      const reportRef = userRef.collection("impressionReports").doc(reportId);

      tx.update(shareRef, {
        clicked: true,
        unlocked: true,
        clickedAt: now,
        unlockedAt: now,
      });
      tx.set(
        reportRef,
        {
          extraMetricsUnlocked: true,
          updatedAt: now,
        },
        { merge: true }
      );
      tx.set(
        userRef,
        {
          impressionSharedMetricsUnlocked: true,
          shareUnlockCount: FieldValue.increment(1),
        },
        { merge: true }
      );

      return "unlocked" as const;
    });

    if (result === "not_found" || result === "invalid") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, ok: true, status: result });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
