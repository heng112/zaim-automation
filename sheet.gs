function insertCell(date, from, num) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('nuro光');
    // 転記
    let n = String(num + 2);
    // Logger.log(`A${n}`);
  const values = sheet.getRange(`A${n}`).setValue(date);
  const value = sheet.getRange(`B${n}`).setValue(from);
}
