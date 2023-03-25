const row = 2; //操作する行の選択
const cell = {
  'date': `A${row}`,
  'year': `D${row}`,
  'month': `E${row}`,
  'bill': `F${row}`,
  'url': `G${row}`
}


function test() {
  Logger.log(formatDate(getRange(range['date']), 'gmail'));
}

function operateLooopDenki() {
  //処理の発動条件　要修正

  loopDenkiGmail();

  if (!(getCell(cell['bill']) && getCell(cell['url']))) {
    const year = getCell(cell['year']);
    const month = getCell(cell['month']);
    fileURL = tryAndError(year, month);
    ocrAnalysis(fileURL);
    inputPayment();
  }

}


function formatDate(dt, format) {
  let y = dt.getFullYear();
  let m = ('00' + (dt.getMonth() + 1)).slice(-2);
  let d = ('00' + dt.getDate()).slice(-2);

  switch (format) {
    case 'gmail':
      return (y + '/' + m + '/' + d);
      break;
    case 'zaim':
      return (y + '-' + m + '-' + d);
      break;
  }
}
function getCell(cell) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('loop電気');
  const value = sheet.getRange(cell).getValue();
  return value;
}

function insertCell(format, sheetName, ...arg) {
  Logger.log(arg);
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

  switch (format) {
    case 'gmail':
      // 転記
      // Logger.log(year);
      sheet.insertRowBefore(row);
      sheet.getRange(`A${row}`).setValue(arg[0]);
      sheet.getRange(`B${row}`).setValue(arg[1]);
      sheet.getRange(`C${row}`).setValue(arg[2]);
      sheet.getRange(`D${row}`).setValue(arg[3]);
      sheet.getRange(`E${row}`).setValue(arg[4]);
      break;

    case 'login':
      sheet.getRange(`F${row}`).setValue(arg[0]);
      sheet.getRange(`G${row}`).setValue(arg[1]);
      break;

    case 'ocr':
      sheet.getRange(`H${row}`).setValue(arg[0]['基本料金']);
      sheet.getRange(`I${row}`).setValue(arg[0]['電気量料金']);
      sheet.getRange(`J${row}`).setValue(arg[0]['夏季(単価/円)']);
      sheet.getRange(`K${row}`).setValue(arg[0]['夏季(数量/kwh)']);
      sheet.getRange(`L${row}`).setValue(arg[0]['オプション']);
      sheet.getRange(`M${row}`).setValue(arg[0]['その他料金']);
      sheet.getRange(`N${row}`).setValue(arg[0]['燃料費等調整額']);
      sheet.getRange(`O${row}`).setValue(arg[0]['燃料費等調整額(単価/円)']);
      sheet.getRange(`P${row}`).setValue(arg[0]['燃料費等調整額(数量/kwh)']);
      sheet.getRange(`Q${row}`).setValue(arg[0]['再生可能ｴﾈﾙｷﾞｰ発電促進賦課金']);
      sheet.getRange(`R${row}`).setValue(arg[0]['再エネ発電賦課金(単価/円)']);
      sheet.getRange(`S${row}`).setValue(arg[0]['再エネ発電賦課金(数量/kwh)']);
      break;
  }
}


//OCR解析
function ocrAnalysis(fileURL) {
  const fileId = fileURL.split('/')[5];
  let image = Drive.Files.copy(
    {
      title: "OCR解析"
    },
    fileId,
    {
      "ocr": true,// OCRを行うかの設定
      "ocrLanguage": "ja",// 言語の設定
    }
  );
  let text = DocumentApp.openById(image.id).getBody().getText();
  Drive.Files.remove(image.id)
  let t = text.split('\n');

  let tt = {
    '基本料金': t[67],
    '電気量料金': t[68],
    '夏季(単価/円)': t[52],
    '夏季(数量/kwh)': t[56],
    'オプション': t[66],
    'その他料金': t[67],
    '燃料費等調整額': t[68],
    '燃料費等調整額(単価/円)': t[54],
    '燃料費等調整額(数量/kwh)': t[57],
    '再生可能ｴﾈﾙｷﾞｰ発電促進賦課金': t[71],
    '再エネ発電賦課金(単価/円)': t[55],
    '再エネ発電賦課金(数量/kwh)': t[58],

  }
  Logger.log(t);
  // insertCell('ocr', 'loop電気', tt, ' ', ' ');
  console.log(tt);
}


function inputDataParams(sheetName = 'loop電気') {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  const d = sheet.getRange(`A${row}`).getValue();
  const n = sheet.getRange(`H1:S1`).getValues();
  const vl = sheet.getRange(`H${row}:S${row}`).getValues();

  let l = [];
  let ll = [];

  let decre = i => i - ll.length;
  let convert = (v, i) => {
    let strList = String(n[0][i]).split('');
    strList.splice(strList.findIndex((s) => s.match(/\(/)), 0, vl[0][i]);
    ll.push(strList);

    if (ll.length % 2 == 0) {
      lll = String(ll.slice(-2)).replace(/,/g, '');
      l[decre(i)].push(lll);
    }
  }

  n[0].forEach((v, i) => { (!(v.match(/\(.*\)/))) ? l.push([n[0][i], vl[0][i]]) : convert(v, i) });
  return (createBody(l, d));
}


function createBody(l, d) {
  let resouce = (v) => {
    let b = {
      'mapping': 1,
      'category_id': 105,
      'genre_id': 10502,
      'amount': v[1],
      'date': formatDate(d),
      'name': v[0],
      "receipt_id": 11111,
      'place': 'looop電気'
    }

    if (v.length == 3) {
      b['comment'] = v[2]
    }
    return b
  }
  return l.map(resouce);
}

