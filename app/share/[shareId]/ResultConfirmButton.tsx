"use client";

import { useState } from "react";

const APP_DOWNLOAD_URL = "";

type Status = "idle" | "loading" | "success" | "error";

export function ResultConfirmButton({ shareId }: { shareId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleShareConfirm = async () => {
    if (status === "loading" || status === "success") return;

    setStatus("loading");

    try {
      const res = await fetch("/api/share-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shareId }),
      });
      const text = await res.text();

      if (res.ok) {
        setStatus("success");
        setMessage("친구가 링크를 열면 지표 2개가 해금됩니다.");
      } else {
        setStatus("error");
        setMessage(text || "공유 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setStatus("error");
      setMessage("공유 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  const handleDownload = () => {
    if (!APP_DOWNLOAD_URL) return;

    window.location.href = APP_DOWNLOAD_URL;
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleShareConfirm}
        disabled={status === "loading" || status === "success"}
        className="block min-h-[52px] w-full rounded-2xl bg-white px-5 py-4 text-sm font-black text-black disabled:cursor-default disabled:opacity-70"
      >
        {status === "loading"
          ? "공유 확인 중..."
          : "공유 확인하고 친구 지표 해금하기"}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={!APP_DOWNLOAD_URL}
        className="block min-h-[52px] w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-4 text-sm font-black text-white disabled:cursor-not-allowed disabled:text-white/45"
      >
        {APP_DOWNLOAD_URL ? "나도 MAXXED 시작하기" : "앱 다운로드 준비 중"}
      </button>

      {message ? (
        <p
          className={`text-center text-sm font-semibold leading-6 ${
            status === "error" ? "text-red-200" : "text-white/70"
          }`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
