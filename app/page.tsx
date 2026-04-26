import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#070a10] px-6 py-12 text-white">
      <section className="w-full max-w-xl rounded-[28px] border border-white/10 bg-[#111827] p-8">
        <p className="mb-5 text-xs font-black tracking-[0.28em] text-amber-300">
          MAXXED
        </p>
        <h1 className="text-3xl font-black leading-tight">
          AI가 분석한 첫인상 결과
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          공유 링크를 통해 첫인상 분석 티저를 확인할 수 있습니다.
        </p>
        <Link
          href="https://maxxed.app"
          className="mt-7 inline-flex min-h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-black text-slate-900"
        >
          MAXXED로 이동
        </Link>
      </section>
    </main>
  );
}
