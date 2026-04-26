"use client";

import { useState } from "react";

export function ResultConfirmButton() {
  const [message, setMessage] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() =>
          setMessage(
            "공유 확인이 완료되었습니다. 앱으로 돌아가 추가 지표를 확인하세요."
          )
        }
        className="block w-full rounded-2xl bg-white px-5 py-4 font-bold text-black"
      >
        결과 확인하기
      </button>

      {message ? (
        <p className="mt-4 text-sm font-semibold leading-6 text-white/70">
          {message}
        </p>
      ) : null}
    </>
  );
}
