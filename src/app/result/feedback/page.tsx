"use client";

import Link from "next/link";
import { useState } from "react";

const REASONS = [
  "判定結果が間違っている",
  "判定理由の説明が分かりにくい",
  "原材料の文字を正しく読み取れていない",
  "判定に時間がかかりすぎる",
  "アレルゲンの選択肢に欲しいものがない",
  "その他",
];

export default function FeedbackPage() {
  const [satisfied, setSatisfied] = useState<boolean | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [free, setFree] = useState("");
  const [done, setDone] = useState(false);

  const toggle = (reason: string) => {
    setChecked((cur) =>
      cur.includes(reason) ? cur.filter((x) => x !== reason) : [...cur, reason]
    );
  };

  const submit = async () => {
    // MVP: とりあえずLocalStorageへ保存（将来はKVへ送信）
    const payload = {
      satisfied,
      reasons: checked,
      detail: free.trim(),
      ts: new Date().toISOString(),
      last: sessionStorage.getItem("lastJudgment"),
    };
    try {
      const past = JSON.parse(localStorage.getItem("feedbacks") || "[]");
      past.push(payload);
      localStorage.setItem("feedbacks", JSON.stringify(past));
      setDone(true);
    } catch {
      setDone(true);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
          <Link href="/result" className="btn-secondary">← 戻る</Link>
          <div className="text-base text-gray-500">5 / 5</div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-10">
          <div className="card">
            <h1 className="text-2xl font-bold mb-2">ご協力ありがとうございました！</h1>
            <p className="text-gray-700 mb-4">
              いただいたフィードバックは今後の改善に活用します。
            </p>
            <div className="flex gap-3">
              <Link href="/" className="btn-secondary">トップへ戻る</Link>
              <a
                href="https://twitter.com/intent/tweet?text=%E3%81%82%E3%82%93%E3%81%97%E3%82%93%E3%82%B9%E3%82%B3%E3%82%A2%E3%83%A9%E3%82%A4%E3%83%88%E3%81%A7%E9%A3%9F%E5%93%81%E5%88%A4%E5%AE%9A%E5%AE%8C%E4%BA%86%EF%BC%81%E5%8E%9F%E6%9D%90%E6%96%99%E5%86%99%E7%9C%9F%E3%82%92%E6%92%AE%E3%82%8B%E3%81%A0%E3%81%91%E3%81%A7%E3%80%81%E3%82%A2%E3%83%AC%E3%83%AB%E3%82%AE%E3%83%BC%E5%AF%BE%E5%BF%9C%E3%81%8C%E4%B8%80%E7%9E%AC%E3%81%A7%E5%88%86%E3%81%8B%E3%82%8B%20%23%E3%81%82%E3%82%93%E3%81%97%E3%82%93%E3%82%B9%E3%82%B3%E3%82%A2%E3%83%A9%E3%82%A4%E3%83%88"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                X（旧Twitter）でシェア
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canSubmit = satisfied !== null && (satisfied || checked.length > 0 || free.trim().length > 0);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
        <Link href="/result" className="btn-secondary">← 戻る</Link>
        <div className="text-base text-gray-500">5 / 5</div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <h1 className="text-2xl font-bold mb-4">フィードバック</h1>

        <div className="card mb-4">
          <div className="text-sm text-gray-600 mb-2">満足度</div>
          <div className="flex gap-3">
            <button
              onClick={() => setSatisfied(true)}
              className={`pill ${satisfied === true ? "bg-green-50 text-green-700 border-green-300" : "bg-white border-gray-200 text-gray-800"}`}
            >
              😊 満足
            </button>
            <button
              onClick={() => setSatisfied(false)}
              className={`pill ${satisfied === false ? "bg-red-50 text-red-700 border-red-300" : "bg-white border-gray-200 text-gray-800"}`}
            >
              😥 不満足
            </button>
          </div>
        </div>

        {satisfied === false && (
          <>
            <div className="card mb-4">
              <div className="text-sm text-gray-600 mb-2">不満足の理由（複数選択可）</div>
              <div className="flex flex-wrap gap-2">
                {REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => toggle(r)}
                    className={`pill ${checked.includes(r)
                        ? "bg-orange-50 text-orange-700 border-orange-300"
                        : "bg-white text-gray-800 border-gray-200"}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="card mb-6">
              <div className="text-sm text-gray-600 mb-2">詳しく（任意）</div>
              <textarea
                className="w-full min-h-[120px] p-4 border border-gray-200 rounded-xl resize-none"
                placeholder="どの点が気になりましたか？"
                value={free}
                onChange={(e) => setFree(e.target.value)}
              />
            </div>
          </>
        )}

        <div className="fixed left-0 right-0 bottom-0 mx-auto max-w-3xl px-4 py-4 bg-white border-t">
          <button
            onClick={submit}
            disabled={!canSubmit}
            className={`w-full text-center ${!canSubmit ? "btn-secondary opacity-60 cursor-not-allowed" : "btn-primary"}`}
          >
            送信する
          </button>
        </div>
      </div>
    </div>
  );
}
