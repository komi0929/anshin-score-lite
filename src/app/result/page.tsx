'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface JudgmentResult {
  result: 'success' | 'warning' | 'danger';
  message: string;
  details: string;
  timestamp: string;
}

export default function ResultPage() {
  const [result, setResult] = useState<JudgmentResult | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // localStorageから判定結果を取得
    const storedResult = localStorage.getItem('judgmentResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    } else {
      // 結果がない場合はホームに戻す
      router.push('/');
    }
  }, [router]);

  const getResultConfig = (resultType: string) => {
    switch (resultType) {
      case 'success':
        return {
          emoji: '✅',
          title: '合格',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          buttonColor: 'bg-green-100 text-green-700'
        };
      case 'warning':
        return {
          emoji: '⚠️',
          title: '要注意',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-800',
          buttonColor: 'bg-orange-100 text-orange-700'
        };
      case 'danger':
        return {
          emoji: '❌',
          title: '不合格',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          buttonColor: 'bg-red-100 text-red-700'
        };
      default:
        return {
          emoji: '❓',
          title: '不明',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          buttonColor: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const handleFeedback = () => {
    router.push('/feedback');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">結果を読み込み中...</p>
        </div>
      </div>
    );
  }

  const config = getResultConfig(result.result);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル専用固定ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <Link href="/photo-capture" className="text-orange-500 text-lg">
            ← 戻る
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">判定結果</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 判定結果メイン */}
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-6 mb-6 text-center`}>
          <div className="text-6xl mb-4">{config.emoji}</div>
          <h2 className={`text-2xl font-bold mb-2 ${config.textColor}`}>
            {config.title}
          </h2>
          <p className={`${config.textColor} text-lg`}>
            {result.message}
          </p>
        </div>

        {/* 詳細説明（アコーディオン） */}
        <div className="bg-white rounded-2xl shadow-sm mb-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className={`w-full p-4 text-left flex items-center justify-between ${config.buttonColor} rounded-2xl transition-all`}
          >
            <span className="font-semibold">詳細な説明</span>
            <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
              ⌄
            </span>
          </button>
          
          {showDetails && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-gray-700 leading-relaxed">
                {result.details}
              </p>
            </div>
          )}
        </div>

        {/* 気づいてよかった！メッセージ */}
        {result.result === 'danger' && (
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-center">
            <div className="text-2xl mb-2">💡</div>
            <p className="text-blue-800 font-semibold">
              気づいてよかった！
            </p>
            <p className="text-blue-700 text-sm mt-1">
              事前にチェックできて安心ですね
            </p>
          </div>
        )}

        {/* 再判定ボタン */}
        <div className="text-center mb-6">
          <Link
            href="/photo-capture"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all transform active:scale-95"
          >
            📸 別の商品を判定する
          </Link>
        </div>

        {/* タイムスタンプ */}
        <div className="text-center text-xs text-gray-500 mb-20">
          判定日時: {new Date(result.timestamp).toLocaleString('ja-JP')}
        </div>
      </div>

      {/* 固定フィードバックボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <button
          onClick={handleFeedback}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-4 rounded-xl transition-all transform active:scale-95"
        >
          この結果について教える
        </button>
      </div>
    </div>
  );
}