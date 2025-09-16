"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PhotoCapturePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setImgDataUrl(reader.result as string);
    reader.readAsDataURL(f);
  };

  const doJudge = async () => {
    if (!imgDataUrl) {
      alert("画像を選択してください");
      return;
    }
    const allergens = JSON.parse(localStorage.getItem("selectedAllergens") || "[]");
    if (!Array.isArray(allergens) || allergens.length === 0) {
      alert("アレルギーを選択してください");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imgDataUrl, allergens }),
      });
      const data = await res.json();
      sessionStorage.setItem("lastJudgment", JSON.stringify(data));
      router.push("/result");
    } catch (e) {
      alert("判定に失敗しました。通信状況をご確認ください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
        <Link href="/allergen-select" className="btn-secondary">← 戻る</Link>
        <div className="text-base text-gray-500">3 / 5</div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <h1 className="text-2xl font-bold mb-4">原材料表示を撮影 / 画像選択</h1>
        <p className="text-gray-600 mb-4">
          できるだけ明るく、歪みなく撮影してください。ピンボケに注意。
        </p>

        <div className="card mb-4">
          <div className="flex gap-3">
            <button className="btn-secondary" onClick={() => fileRef.current?.click()}>
              画像を選ぶ（カメラ/ギャラリー）
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onPick}
            />
            {imgDataUrl && <span className="pill border-gray-200">選択済み</span>}
          </div>
        </div>

        {imgDataUrl && (
          <div className="card mb-6">
            <div className="text-sm text-gray-500 mb-2">プレビュー</div>
            <img src={imgDataUrl} alt="preview" className="rounded-lg border max-h-[420px] object-contain" />
          </div>
        )}

        <div className="fixed left-0 right-0 bottom-0 mx-auto max-w-3xl px-4 py-4 bg-white border-t">
          <button
            onClick={doJudge}
            disabled={loading || !imgDataUrl}
            className={`w-full text-center ${loading || !imgDataUrl ? "btn-secondary opacity-60 cursor-not-allowed" : "btn-primary"}`}
          >
            {loading ? "判定中..." : "この画像で判定する"}
          </button>
        </div>
      </div>
    </div>
  );
}
