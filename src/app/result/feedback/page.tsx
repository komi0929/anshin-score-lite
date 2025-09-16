'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DISSATISFACTION_REASONS = [
  '判定結果が間違っている',
  '判定理由の説明が分かりにくい',
  '原材料の文字を正しく読み取れていない',
  '判定に時間がかかりすぎる',
  'アレルゲンの選択肢に欲しいものがない',
  'その他'
];

export default function FeedbackPage() {
  const [satisfaction, setSatisfaction] = useState<'satisfied' | 'dissatisfied' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);
  const router = useRouter();

  const toggleReason = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason) 
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (!satisfaction) {
      alert('満足度を選択してください');
      return;
    }

    setIsSubmitting(true);

    // フィードバックデータを作成
    const feedbackData = {
      satisfaction,
      reasons: satisfaction === 'dissatisfied' ? selectedReasons : [],
      otherReason: satisfaction === 'dissatisfied' ? otherReason : '',
      timestamp: new Date().toISOString()
    };

    // localStorageに保存（実際のAPIは後で実装）
    localStorage.setItem('feedback', JSON.stringify(feedbackData));

    // 満足の場合はSNSシェアボタンを表示
    if (satisfaction === 'satisfied') {
      setShowShareButtons(true);
    }

    setIsSubmitting(false);

    // 2秒後にホームに戻る
    setTimeout(() => {
      router.push('/');
    }, 2000);
  };

  const shareToTwitter = () => {
    const text = `📱 あんしんスコアライト で食品判定完了！
🔍 原材料写真を撮るだけで、アレルギー対応が一瞬で分かる
✅ 今日も安心して食べられました

#あんしんスコアライト #アレルギー対応 #食の安心`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const shareToLine = () => {
    const text = `あんしんスコアライト で食品判定完了！原材料写真を撮るだけで、アレルギー対応が一瞬で分かります。`;
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  if (showShareButtons) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="px-4 py-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              フィードバックありがとうございます！
            </h1>
            <p className="text-gray-600">
              よろしければ、みんなにも教えてください
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={shareToTwitter}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all transform active:scale-95"
            >
              <span className="text-xl">🐦</span>
              <span>Twitterでシェア</span>
            </button>

            <button
              onClick={shareToLine}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-xl flex items-center justify-center space-x-3 transition-all transform active:scale-95"
            >
              <span className="text-xl">💬</span>
              <span>LINEでシェア</span>
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-xl transition-all transform active:scale-95"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* モバイル専用固定ヘッダー */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <Link href="/result" className="text-orange-500 text-lg">
            ← 戻る
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">フィードバック</h1>
          <div className="w-12"></div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* 満足度選択 */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            判定結果はいかがでしたか？
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSatisfaction('satisfied')}
              className={`p-6 rounded-2xl border-2 transition-all transform active:scale-95 ${
                satisfaction === 'satisfied'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">😊</div>
              <div className="font-semibold">満足</div>
            </button>

            <button
              onClick={() => setSatisfaction('dissatisfied')}
              className={`p-6 rounded-2xl border-2 transition-all transform active:scale-95 ${
                satisfaction === 'dissatisfied'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-4xl mb-2">😔</div>
              <div className="font-semibold">不満足</div>
            </button>
          </div>
        </div>

        {/* 不満足の理由（不満足選択時のみ表示） */}
        {satisfaction === 'dissatisfied' && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                不満足の理由を教えてください（複数選択可）
              </h3>
              <div className="space-y-3">
                {DISSATISFACTION_REASONS.map((reason) => (
                  <button
                    key={reason}
                    onClick={() => toggleReason(reason)}
                    className={`w-full text-left p-4 rounded-xl border transition-all transform active:scale-95 ${
                      selectedReasons.includes(reason)
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        selectedReasons.includes(reason)
                          ? 'border-orange-500 bg-orange-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedReasons.includes(reason) && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </div>
                      <span className="text-sm">{reason}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                詳しく教えてください（任意）
              </h3>
              <textarea
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
                placeholder="改善してほしい点や感想をお聞かせください"
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all duration-200 min-h-[100px] resize-none"
              />
            </div>
          </>
        )}

        {/* 送信ボタン */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <button
            onClick={handleSubmit}
            disabled={!satisfaction || isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              satisfaction && !isSubmitting
                ? 'bg-orange-500 hover:bg-orange-600 text-white transform active:scale-95'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>送信中...</span>
              </div>
            ) : (
              '送信する'
            )}
          </button>
        </div>
      </div>

      {/* ボタン用の余白 */}
      <div className="h-20"></div>
    </div>
  );
}