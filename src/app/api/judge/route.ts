import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 独自アレルゲン辞書
const ALLERGEN_DICTIONARY = {
  // 誤判定防止
  safe_compounds: {
    '豆乳': '大豆由来（乳アレルゲンではない）',
    'ココナッツミルク': '植物性（乳アレルゲンではない）',
    'アーモンドミルク': 'ナッツ系（乳アレルゲンではない）',
    'ライスミルク': '米由来（乳アレルゲンではない）',
    'オーツミルク': 'オーツ麦由来（乳アレルゲンではない）'
  },
  
  // 類語・別名辞書
  allergen_aliases: {
    '卵': ['卵白', '卵黄', 'エッグ', 'オボアルブミン', 'レシチン（卵由来）', '全卵'],
    '乳': ['牛乳', 'バター', 'チーズ', 'ホエイ', 'カゼイン', 'ラクトース', 'クリーム', 'ヨーグルト'],
    '小麦': ['小麦粉', 'グルテン', 'ウィート', 'デュラム', 'セモリナ', '強力粉', '薄力粉'],
    'えび': ['海老', 'エビ', 'シュリンプ', '車海老', '甘海老'],
    'かに': ['蟹', 'カニ', 'クラブ', 'ズワイガニ', 'タラバガニ'],
    'くるみ': ['胡桃', 'ウォルナット', 'クルミ'],
    'そば': ['蕎麦', 'ソバ', 'buckwheat'],
    '落花生': ['ピーナッツ', '落花生', 'peanut', '南京豆']
  },

  // 製造工程リスク
  contamination_keywords: [
    '同一ラインで', '同一設備で', '本品製造工場では', '製造ラインで',
    'コンタミネーション', '微量混入', '同じ工場で'
  ]
};

// 独自判定システム
function customAllergenAnalysis(chatgptResult: any, selectedAllergens: string[]) {
  const analysis = {
    finalResult: chatgptResult.result,
    corrections: [],
    warnings: [],
    details: chatgptResult.details
  };

  // 1. 誤判定の修正
  for (const [safeCompound, explanation] of Object.entries(ALLERGEN_DICTIONARY.safe_compounds)) {
    if (chatgptResult.ingredients?.includes(safeCompound)) {
      const correction = `${safeCompound}は${explanation}`;
      analysis.corrections.push(correction);
      
      // 乳アレルギーの誤判定を修正
      if (selectedAllergens.includes('乳') && safeCompound.includes('ミルク')) {
        analysis.finalResult = 'success';
        analysis.details = `${correction}。安心してお召し上がりいただけます。`;
      }
    }
  }

  // 2. 類語・別名のチェック
  for (const allergen of selectedAllergens) {
    const aliases = ALLERGEN_DICTIONARY.allergen_aliases[allergen];
    if (aliases) {
      for (const alias of aliases) {
        if (chatgptResult.ingredients?.includes(alias)) {
          analysis.warnings.push(`${alias}は${allergen}の別名・関連成分です`);
          if (analysis.finalResult === 'success') {
            analysis.finalResult = 'danger';
            analysis.details = `${alias}が含まれています。これは${allergen}アレルゲンです。`;
          }
        }
      }
    }
  }

  // 3. 製造工程リスクの検出
  for (const keyword of ALLERGEN_DICTIONARY.contamination_keywords) {
    if (chatgptResult.ingredients?.includes(keyword)) {
      analysis.warnings.push(`製造工程での混入リスクがあります（${keyword}）`);
      if (analysis.finalResult === 'success') {
        analysis.finalResult = 'warning';
        analysis.details = `製造工程で他のアレルゲンとの接触の可能性があります。微量の混入リスクにご注意ください。`;
      }
    }
  }

  return analysis;
}

export async function POST(request: NextRequest) {
  try {
    const { image, allergens } = await request.json();

    if (!image || !allergens || allergens.length === 0) {
      return NextResponse.json(
        { error: 'Image and allergens are required' },
        { status: 400 }
      );
    }

    // ChatGPT Vision API で一次判定
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `あなたは食品アレルギー判定の専門家です。

画像の原材料表示を読み取り、以下のアレルゲンが含まれているかを判定してください：
${allergens.join('、')}

判定基準：
- 明確にアレルゲンが含まれている → danger
- アレルゲンが含まれていない → success
- 判断に迷う場合（製造ライン混入、不明な成分） → warning

以下のJSON形式で回答してください：
{
  "result": "success/warning/danger",
  "message": "判定結果の簡潔な説明",
  "details": "詳細な理由と注意点",
  "ingredients": "読み取った原材料テキスト"
}`
            },
            {
              type: 'image_url',
              image_url: {
                url: image
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.1
    });

    let chatgptResult;
    try {
      chatgptResult = JSON.parse(response.choices[0].message.content || '{}');
    } catch (parseError) {
      // JSONパースに失敗した場合のフォールバック
      chatgptResult = {
        result: 'warning',
        message: '判定処理中にエラーが発生しました',
        details: 'もう一度お試しください',
        ingredients: ''
      };
    }

    // 独自判定システムで二次判定
    const finalAnalysis = customAllergenAnalysis(chatgptResult, allergens);

    // 結果を保存（実際のDBは後で実装）
    const judgmentData = {
      timestamp: new Date().toISOString(),
      allergens,
      chatgptResult,
      finalAnalysis,
      finalResult: finalAnalysis.finalResult,
      message: getResultMessage(finalAnalysis.finalResult),
      details: finalAnalysis.details
    };

    return NextResponse.json(judgmentData);

  } catch (error) {
    console.error('Judgment error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        result: 'warning',
        message: '判定処理中にエラーが発生しました',
        details: 'ネットワーク接続を確認して、もう一度お試しください。'
      },
      { status: 500 }
    );
  }
}

function getResultMessage(result: string): string {
  switch (result) {
    case 'success':
      return '合格：安心してお召し上がりいただけます';
    case 'warning':
      return '要注意：念のためご確認ください';
    case 'danger':
      return '不合格：このアレルゲンが含まれています';
    default:
      return '判定結果を確認できませんでした';
  }
}