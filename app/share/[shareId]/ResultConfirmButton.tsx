"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ResultConfirmButton({ shareId }: { shareId: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const handleClick = async () => {
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
        setMessage(
          "공유 확인이 완료되었습니다. 앱으로 돌아가 추가 지표를 확인하세요."
        );
      } else {
        setStatus("error");
        setMessage(text || "공유 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch {
      setStatus("error");
      setMessage("공유 확인에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading" || status === "success"}
        className="block w-full rounded-2xl bg-white px-5 py-4 font-bold text-black disabled:cursor-default disabled:opacity-70"
      >
        {status === "loading" ? "확인 중..." : "결과 확인하기"}
      </button>

      {status === "success" ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-white/70">
          {message}
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-red-200">
          {message}
        </p>
      ) : null}
    </>
  );
}
