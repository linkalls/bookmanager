// ISBN-13からISBN-10に変換（チェックディジット計算込み）
export function isbn13ToIsbn10(isbn13: string): string | null {
  // 数字のみ抽出
  const digits = isbn13.replace(/[^0-9]/g, '');
  
  // 13桁でなければnull
  if (digits.length !== 13) {
    return null;
  }
  
  // 978で始まらなければ変換不可
  if (!digits.startsWith('978')) {
    return null;
  }
  
  // 978を除いた9桁を取得
  const isbn9 = digits.slice(3, 12);
  
  // チェックディジット計算
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn9[i]) * (10 - i);
  }
  
  const remainder = sum % 11;
  const checkDigit = 11 - remainder;
  
  let checkChar: string;
  if (checkDigit === 10) {
    checkChar = 'X';
  } else if (checkDigit === 11) {
    checkChar = '0';
  } else {
    checkChar = checkDigit.toString();
  }
  
  return isbn9 + checkChar;
}

// ISBN-10かどうか判定（既に10桁なら変換不要）
export function isIsbn10(isbn: string): boolean {
  const digits = isbn.replace(/[^0-9X]/gi, '');
  return digits.length === 10;
}

// ISBNからAmazon URLを生成
export function getAmazonUrl(isbn: string | undefined): string | null {
  if (!isbn) return null;
  
  const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
  
  let asin: string | null = null;
  
  if (cleanIsbn.length === 10) {
    // 既にISBN-10
    asin = cleanIsbn;
  } else if (cleanIsbn.length === 13) {
    // ISBN-13から変換
    asin = isbn13ToIsbn10(cleanIsbn);
  }
  
  if (!asin) return null;
  
  // Amazon.co.jpのURLを返す
  return `https://www.amazon.co.jp/dp/${asin}`;
}
