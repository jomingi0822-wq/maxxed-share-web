import type { Metadata } from "next";
import { ResultConfirmButton } from "./ResultConfirmButton";

const teaserItems = ["첫인상 점수", "상위 퍼센트", "매력 포인트", "개선 루틴"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;

  return {
    title: "MAXXED AI 첫인상 분석",
    description: "AI가 분석한 첫인상 점수와 개선 루틴을 확인해보세요.",
    openGraph: {
      title: "AI가 보는 첫인상 점수, 확인해보세요",
      description: "MAXXED에서 얼굴 인상과 개선 루틴을 분석해보세요.",
      images: ["/share-preview.png"],
      url: `/share/${shareId}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI가 보는 첫인상 점수, 확인해보세요",
      description: "MAXXED에서 얼굴 인상과 개선 루틴을 분석해보세요.",
      images: ["/share-preview.png"],
    },
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ shareId: string }>;
}) {
  const { shareId } = await params;

  return (
    <main className="min-h-screen bg-[#080808] px-5 py-8 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center">
        <div className="mb-5 inline-flex w-fit items-center rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold text-white/70">
          친구가 공유한 AI 첫인상 분석
        </div>

        <h1 className="whitespace-nowrap text-[21px] font-black leading-tight tracking-normal">
          당신의 첫인상은 몇점인가요?
        </h1>
        <p className="mt-4 text-base font-semibold leading-7 text-white/70">
          상위 몇 %인지 직접 확인해보세요.
        </p>
        <p className="mt-3 text-sm leading-6 text-white/60">
          Maxxed는 얼굴 인상, 분위기, 매력 포인트를 분석하고
          <br />
          매일 개선 루틴까지 제공하는 외모 개선 앱입니다.
        </p>

        <div className="mt-7 grid grid-cols-2 gap-3">
          {teaserItems.map((item) => (
            <div
              key={item}
              className="min-h-28 rounded-2xl border border-white/10 bg-white/10 p-4"
            >
              <p className="text-xs font-bold text-white/54">{item}</p>
              <div className="mt-5 h-3 w-20 rounded-full bg-white/18 blur-[2px]" />
              <div className="mt-3 h-3 w-14 rounded-full bg-white/14 blur-[2px]" />
              <p className="mt-5 text-xs font-bold text-white/42">잠금</p>
            </div>
          ))}
        </div>

        <div className="mt-7">
          <ResultConfirmButton shareId={shareId} />
        </div>

        <p className="mt-6 text-center text-sm font-semibold leading-6 text-white/54">
          친구처럼 나도 AI 분석 받고 숨겨진 개선 포인트를 확인해보세요.
        </p>
      </section>
    </main>
  );
}
