import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="text-6xl mb-4">📱</div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              あんしんスコアライト
            </h1>
            <p className="text-xl text-gray-600">
              原材料写真を撮るだけで、アレルギー対応が一瞬で分かる
            </p>
          </div>
        </div>

        {/* 特徴 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="text-3xl mb-3">📸</div>
              <h3 className="font-semibold text-lg mb-2">写真を撮るだけ</h3>
              <p className="text-gray-600 text-sm">原材料表示を撮影するだけの簡単操作</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">瞬間判定</h3>
              <p className="text-gray-600 text-sm">AIが数秒で安全性を判定</p>
            </div>
            
            <div className="card text-center">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-semibold text-lg mb-2">高精度</h3>
              <p className="text-gray-600 text-sm">独自技術で誤判定を防止</p>
            </div>
          </div>
        </div>

        {/* 使い方 */}
        <div className="max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
            使い方はとても簡単
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">1</div>
              <span className="text-gray-700">アレルギーを選択</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">2</div>
              <span className="text-gray-700">原材料表示を撮影</span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded-xl">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">3</div>
              <span className="text-gray-700">判定結果を確認</span>
            </div>
          </div>
        </div>

        {/* スタートボタン */}
        <div className="text-center">
          <Link href="/allergen-select" className="btn-primary inline-block text-xl px-12 py-4">
            はじめる
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            ユーザー登録不要・無料で使えます
          </p>
        </div>
      </div>
    </div>
  );
}