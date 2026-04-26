import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebaseAdmin";

function isBotUserAgent(userAgent: string) {
  return /bot|crawler|spider|preview|facebookexternalhit|twitterbot|discordbot|slackbot|kakaotalk-scrap|telegrambot|whatsapp|line/i.test(
    userAgent
  );
}

export async function POST(request: NextRequest) {
  if (isBotUserAgent(request.headers.get("user-agent") || "")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const body = (await request.json().catch(() => null)) as {
    shareId?: unknown;
  } | null;
  const shareId = typeof body?.shareId === "string" ? body.shareId.trim() : "";

  if (!shareId) {
    return NextResponse.json(
      { ok: false, message: "shareId가 필요합니다." },
      { status: 400 }
    );
  }

  const db = getAdminDb();

  const result = await db.runTransaction(async (transaction) => {
    const shareRef = db.collection("shareReports").doc(shareId);
    const shareSnap = await transaction.get(shareRef);

    if (!shareSnap.exists) {
      return { status: "missing" as const };
    }

    const shareData = shareSnap.data() || {};
    const ownerUid = shareData.ownerUid;
    const reportId = shareData.reportId || "latest";

    if (typeof ownerUid !== "string" || typeof reportId !== "string") {
      return { status: "invalid" as const };
    }

    if (shareData.clicked === true || shareData.unlocked === true) {
      return { status: "already_unlocked" as const };
    }

    const now = FieldValue.serverTimestamp();
    const ownerRef = db.collection("users").doc(ownerUid);
    const reportRef = ownerRef.collection("impressionReports").doc(reportId);

    transaction.update(shareRef, {
      clicked: true,
      clickedAt: now,
      unlocked: true,
      unlockedAt: now,
    });
    transaction.set(
      reportRef,
      {
        extraMetricsUnlocked: true,
        updatedAt: now,
      },
      { merge: true }
    );
    transaction.set(
      ownerRef,
      {
        impressionSharedMetricsUnlocked: true,
        shareUnlockCount: FieldValue.increment(1),
      },
      { merge: true }
    );

    return { status: "unlocked" as const };
  });

  if (result.status === "missing" || result.status === "invalid") {
    return NextResponse.json(
      { ok: false, message: "유효하지 않은 공유 링크입니다." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, status: result.status });
}
