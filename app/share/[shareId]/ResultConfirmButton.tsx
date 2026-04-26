"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function ResultConfirmButton({ shareId }: { shareId: string }) {
  const [status, setStatus] = useState<Status>("idle");

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
      const payload = (await res.json().catch(() => null)) as {
        success?: boolean;
      } | null;

      if (res.ok && payload?.success === true) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
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
          공유 확인이 완료되었습니다. 앱으로 돌아가 추가 지표를 확인하세요.
        </p>
      ) : null}

      {status === "error" ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-red-200">
          공유 확인에 실패했습니다. 잠시 후 다시 시도해주세요.
        </p>
      ) : null}
    </>
  );
}
