"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isbn13ToIsbn10 = isbn13ToIsbn10;
exports.isIsbn10 = isIsbn10;
exports.getAmazonUrl = getAmazonUrl;
// ISBN-13からISBN-10に変換（チェックディジット計算込み）
function isbn13ToIsbn10(isbn13) {
    // 数字のみ抽出
    var digits = isbn13.replace(/[^0-9]/g, '');
    // 13桁でなければnull
    if (digits.length !== 13) {
        return null;
    }
    // 978で始まらなければ変換不可
    if (!digits.startsWith('978')) {
        return null;
    }
    // 978を除いた9桁を取得
    var isbn9 = digits.slice(3, 12);
    // チェックディジット計算
    var sum = 0;
    for (var i = 0; i < 9; i++) {
        sum += parseInt(isbn9[i]) * (10 - i);
    }
    var remainder = sum % 11;
    var checkDigit = 11 - remainder;
    var checkChar;
    if (checkDigit === 10) {
        checkChar = 'X';
    }
    else if (checkDigit === 11) {
        checkChar = '0';
    }
    else {
        checkChar = checkDigit.toString();
    }
    return isbn9 + checkChar;
}
// ISBN-10かどうか判定（既に10桁なら変換不要）
function isIsbn10(isbn) {
    var digits = isbn.replace(/[^0-9X]/gi, '');
    return digits.length === 10;
}
// ISBNからAmazon URLを生成
function getAmazonUrl(isbn) {
    if (!isbn)
        return null;
    var cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
    var asin = null;
    if (cleanIsbn.length === 10) {
        // 既にISBN-10
        asin = cleanIsbn;
    }
    else if (cleanIsbn.length === 13) {
        // ISBN-13から変換
        asin = isbn13ToIsbn10(cleanIsbn);
    }
    if (!asin)
        return null;
    // Amazon.co.jpのURLを返す
    return "https://www.amazon.co.jp/dp/".concat(asin);
}
