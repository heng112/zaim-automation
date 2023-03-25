function loopDenkiGmail() {
  //フィルターは改善の余地あり　
  const query = `subject:ご利用明細更新のお知らせ after:${formatDate(getCell(cell['date']), 'gmail')}`;
  const res = GmailApp.search(query);
  let m = GmailApp.getMessagesForThreads(res); //スレッドからメールを取得する　→二次元配列で格納

  m.map(v => {
    let senderDate = v[0].getDate();
    Logger.log(senderDate);
    Logger.log(getCell(cell['date']));
    if ( senderDate > getCell(cell['date']) ) {
      Logger.log('新規のメールを確認しました。');
      let senderDate = v[0].getDate();
      const formatDate = Utilities.formatDate(senderDate, "JST", "YYYY/MM/dd");
      const date = String(formatDate).split('/');
      Logger.log(date);

      let senderMail = v[0].getFrom();
    Logger.log(senderMail);

      let subject = v[0].getSubject();
      Logger.log(subject);

      insertCell('gmail', 'loop電気', senderDate, senderMail, subject, date[0], date[1]);
    }
  });
}

