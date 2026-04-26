import type { Metadata } from "next";
import { ResultConfirmButton } from "./ResultConfirmButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ shareId: string }>;
}): Promise<Metadata> {
  const { shareId } = await params;

  return {
    title: "MAXXED 첫인상 분석 결과",
    description: "AI가 분석한 첫인상 결과를 확인해보세요.",
    openGraph: {
      title: "AI가 분석한 첫인상 결과가 나왔습니다",
      description: "상위 몇 %인지 직접 확인해보세요.",
      images: ["/share-preview.png"],
      url: `/share/${shareId}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "AI가 분석한 첫인상 결과가 나왔습니다",
      description: "상위 몇 %인지 직접 확인해보세요.",
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
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <p className="mb-3 text-sm text-white/50">MAXXED 공유 결과</p>
        <h1 className="text-3xl font-bold">AI 첫인상 분석 결과</h1>
        <p className="mt-4 text-white/70">
          상위 몇 %인지 직접 확인해보세요.
        </p>

        <div className="my-8 rounded-2xl border border-white/10 bg-black/40 p-6">
          <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-white/10 blur-sm" />
          <p className="text-sm text-white/50">
            결과는 링크를 연 뒤 확인됩니다.
          </p>
        </div>

        <ResultConfirmButton shareId={shareId} />

        <p className="mt-4 text-xs text-white/40">
          실제 분석 이미지는 미리보기에 표시되지 않습니다.
        </p>
      </div>
    </main>
  );
}
