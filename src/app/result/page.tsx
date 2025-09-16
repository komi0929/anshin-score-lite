"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Result = "success" | "warning" | "danger";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("lastJudgment");
    if (raw) setData(JSON.parse(raw));
  }, []);

  const pill = (r: Result) => {
    if (r === "success") return "bg-green-50 text-green-700 border-green-300";
    if (r === "warning") return "bg-yellow-50 text-yellow-800 border-yellow-300";
    return "bg-red-50 text-red-700 border-red-300";
  };

  const title = (r: Result) => {
    if (r === "success") return "合格：安心してお召し上がりいただけます";
    if (r === "warning") return "要注意：念のためご確認ください";
    return "不合格：このアレルゲンが含まれています";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
        <Link href="/photo-capture" className="btn-secondary">← 戻る</Link>
        <div className="text-base text-gray-500">4 / 5</div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <h1 className="text-2xl font-bold mb-4">判定結果</h1>

        {!data ? (
          <div className="card">結果が見つかりません。最初からやり直してください。</div>
        ) : (
          <>
            <div className={`card mb-4`}>
              <div className={`pill ${pill(data.finalResult)} mb-3`}>
                判定：{data.finalResult}
              </div>
              <h2 className="text-xl font-semibold mb-2">{data.message}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {data.details}
              </p>
            </div>

            {/* 補足（辞書補正・警告） */}
            {(data.finalAnalysis?.corrections?.length || 0) > 0 && (
              <div className="card mb-4">
                <h3 className="font-semibold mb-2">補正</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {data.finalAnalysis.corrections.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {(data.finalAnalysis?.warnings?.length || 0) > 0 && (
              <div className="card mb-4">
                <h3 className="font-semibold mb-2">注意事項</h3>
                <ul className="list-disc pl-5 text-gray-700">
                  {data.finalAnalysis.warnings.map((w: string, i: number) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        <div className="fixed left-0 right-0 bottom-0 mx-auto max-w-3xl px-4 py-4 bg-white border-t">
          <div className="flex gap-3">
            <Link href="/photo-capture" className="btn-secondary flex-1 text-center">
              もう一度撮影
            </Link>
            <Link href="/result/feedback" className="btn-primary flex-1 text-center">
              フィードバックへ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
