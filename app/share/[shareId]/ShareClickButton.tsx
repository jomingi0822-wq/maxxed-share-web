"use client";

import { useState } from "react";

export function ShareClickButton({ shareId }: { shareId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const unlock = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("공유 확인 중입니다.");

    try {
      const response = await fetch("/api/share-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shareId }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.ok) {
        throw new Error(payload.message || "공유 확인에 실패했습니다.");
      }

      setMessage("공유 확인 완료. 앱으로 돌아가 추가 지표를 확인하세요.");
    } catch (error) {
      setLoading(false);
      setMessage(
        error instanceof Error ? error.message : "공유 확인에 실패했습니다."
      );
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={unlock}
        disabled={loading}
        className="mt-8 flex min-h-13 w-full items-center justify-center rounded-2xl bg-white px-5 text-[15px] font-black text-slate-900 disabled:opacity-70"
      >
        결과 보러가기
      </button>
      {message ? (
        <p className="mt-4 text-sm font-bold leading-6 text-amber-300">
          {message}
        </p>
      ) : null}
    </>
  );
}
