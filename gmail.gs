function nuroGmail() {
  const query = 'subject:NURO光　お知らせ';
  const res = GmailApp.search(query);
  let m = GmailApp.getMessagesForThreads(res); //スレッドからメールを取得する　→二次元配列で格納
  // Logger.log(m);
  for (var i = 0; i < m.length; i++) {
    // Logger.log(m);
    //メール送信者のアドレス
    let senderMail = m[i][0].getFrom();
    // Logger.log(senderMail);

    let senderDate = m[i][0].getDate();
    // Logger.log(senderDate);

    // メール本文を取得
    let body = m[i][0].getBody();
    // Logger.log(body);

    //とりあえずの判定
    if (i == 0) {
      nuroAccess()
      insertCell(senderDate, senderMail, i);
    }
  }
}

function nuroAccess() {
  //スクレイピング処理
}
