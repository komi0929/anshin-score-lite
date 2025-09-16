"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Item = { id: string; name: string; emoji?: string };

const CORE8: Item[] = [
  { id: "卵", name: "卵", emoji: "🥚" },
  { id: "乳", name: "乳（牛乳）", emoji: "🥛" },
  { id: "小麦", name: "小麦", emoji: "🌾" },
  { id: "えび", name: "えび", emoji: "🦐" },
  { id: "かに", name: "かに", emoji: "🦀" },
  { id: "くるみ", name: "くるみ", emoji: "🌰" },
  { id: "そば", name: "そば", emoji: "🍜" },
  { id: "落花生", name: "落花生（ピーナッツ）", emoji: "🥜" },
];

const PLUS20: Item[] = [
  { id: "アーモンド", name: "アーモンド" },
  { id: "あわび", name: "あわび" },
  { id: "いか", name: "いか" },
  { id: "いくら", name: "いくら" },
  { id: "オレンジ", name: "オレンジ" },
  { id: "カシューナッツ", name: "カシューナッツ" },
  { id: "キウイフルーツ", name: "キウイフルーツ" },
  { id: "牛肉", name: "牛肉" },
  { id: "ごま", name: "ごま" },
  { id: "さけ", name: "さけ" },
  { id: "さば", name: "さば" },
  { id: "大豆", name: "大豆" },
  { id: "鶏肉", name: "鶏肉" },
  { id: "バナナ", name: "バナナ" },
  { id: "豚肉", name: "豚肉" },
  { id: "まつたけ", name: "まつたけ" },
  { id: "もも", name: "もも" },
  { id: "やまいも", name: "やまいも" },
  { id: "りんご", name: "りんご" },
  { id: "ゼラチン", name: "ゼラチン" },
];

export default function AllergenSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [other, setOther] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("selectedAllergens");
    if (saved) setSelected(JSON.parse(saved));
  }, []);

  const toggle = (id: string) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
    );
  };

  const onNext = () => {
    const arr = other.trim() ? [...selected, other.trim()] : selected;
    localStorage.setItem("selectedAllergens", JSON.stringify(arr));
    router.push("/photo-capture");
  };

  const disabled = selected.length === 0 && other.trim() === "";

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-5 flex items-center justify-between">
        <Link href="/" className="btn-secondary">← 戻る</Link>
        <div className="text-base text-gray-500">2 / 5</div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-6">
        <h1 className="text-2xl font-bold mb-4">アレルギーを選択</h1>
        <p className="text-gray-600 mb-6">
          該当するものを選んでください（複数選択可）。その他は自由入力できます。
        </p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">特定原材料（8品目）</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CORE8.map((a) => (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={`pill ${selected.includes(a.id)
                    ? "bg-orange-50 border-orange-500 text-orange-700"
                    : "bg-white border-gray-200 text-gray-800"}`}
              >
                <span>{a.emoji ?? "✅"}</span>
                <span>{a.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-2">準ずるもの（20品目）</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLUS20.map((a) => (
              <button
                key={a.id}
                onClick={() => toggle(a.id)}
                className={`pill ${selected.includes(a.id)
                    ? "bg-orange-50 border-orange-500 text-orange-700"
                    : "bg-white border-gray-200 text-gray-800"}`}
              >
                <span>✅</span>
                <span>{a.name}</span>
              </button>
            ))}
          </div>
        </section>

        <div className="card mb-8">
          <label className="block text-sm font-medium mb-2">その他（自由入力）</label>
          <input
            className="input-field"
            placeholder="例）ごぼう、セロリ など"
            value={other}
            onChange={(e) => setOther(e.target.value)}
          />
        </div>

        <div className="flex gap-3 sticky bottom-0 bg-white py-4">
          <Link href="/" className="btn-secondary flex-1 text-center">戻る</Link>
          <button
            disabled={disabled}
            onClick={onNext}
            className={`flex-1 text-center ${disabled ? "btn-secondary opacity-60 cursor-not-allowed" : "btn-primary"}`}
          >
            次へ（撮影へ）
          </button>
        </div>
      </div>
    </div>
  );
}
