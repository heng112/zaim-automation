const cheerio = libpack.cheerio()
/**
* Cookieのユーティリティクラス
*/
class CookieUtil {
  /**
   * 値を抽出
   * @param {string} cookie Cookieデータ（"name=value;...")
   * @return {string} value
   */
  static getValue(cookies, key) {
    const cookiesArray = cookies.split(';');

    for (const c of cookiesArray) {
      const cArray = c.split('=');
      if (cArray[0] == key) {
        return cArray[1]
      }
    }

    return false
  }
}


function loopDenkiLogin() {
  let response, cookies, content, $, headers, payload, options;


  // ----------
  // ログインページを開く(GET)

  // リクエスト送信
  response = UrlFetchApp.fetch('https://looop-denki.com/mypage/auth/login');

  // レスポンスヘッダーからCookieを取得
  cookies = response.getHeaders()["Set-Cookie"];
  // Cookieから_freee-accounts_sessionを取得
  let cookie_freee_accounts_session = CookieUtil.getValue(cookies, 'denki_front_session');

  // コンテンツ(ログインページのHTML)を取得
  content = response.getContentText("UTF-8");

  $ = cheerio.load(content);
  // 以下のパラメータはログインフォーム内に記載されているため取得
  const token = $('[name="_token"]').val();
  // Logger.log(token);

  // ----------
  // ログインフォーム送信(POST)
  headers = { // リクエストヘッダー
    'cookie': 'denki_front_session=' + cookie_freee_accounts_session + ';',
  }
  payload = { // リクエストパラメータ
    "_token": token,
    "login_id": "",
    "password": ""
  }
  options = {
    'method': 'post', // POSTメソッド
    'headers': headers,
    'payload': payload,
    'followRedirects': false // リダイレクト処理を抑止しておく
  }
  response = UrlFetchApp.fetch('https://looop-denki.com/mypage/auth/login/', options);

  content = response.getContentText("UTF-8");
  // Logger.log(content);

  // _auth_session_idを取得し次のリクエストにセット
  let cookie_auth_session_id;

  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]

    if (CookieUtil.getValue(cookie, 'denki_front_session')) {
      cookie_auth_session_id = CookieUtil.getValue(cookie, 'denki_front_session')
    }
  }

  Utilities.sleep(1000);



  headers = {
    'cookie': 'denki_front_session=' + cookie_auth_session_id + ';',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
  options = {
    'method': 'get',
    'headers': headers,
    'followRedirects': false,
    'muteHttpExceptions': false
  }
  response = UrlFetchApp.fetch('https://looop-denki.com/mypage/', options);

  content = response.getContentText("UTF-8");
  // Logger.log(content);


  $ = cheerio.load(content);

  if ($('.js_button_disabled.p_header_mypage__logout.c_button').length > 0) {
    console.log('success');
  } else {
    console.log('failed');
  }

  Utilities.sleep(1000);
// _auth_session_idを取得し次のリクエストにセット

  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]

    if (CookieUtil.getValue(cookie, 'denki_front_session')) {
      cookie_auth_session_id = CookieUtil.getValue(cookie, 'denki_front_session')
    }
  }

  Utilities.sleep(1000);



  headers = {
    'cookie': 'denki_front_session=' + cookie_auth_session_id + ';',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
  options = {
    'method': 'get',
    'headers': headers,
    'followRedirects': false,
    'muteHttpExceptions': false
  }
  response = UrlFetchApp.fetch('https://looop-denki.com/mypage/invoice/detail/', options);

  content = response.getContentText("UTF-8");
  // Logger.log(content);


  Utilities.sleep(1000);



 content = response.getContentText("UTF-8");
  $ = cheerio.load(content);
  // 以下のパラメータはログインフォーム内に記載されているため取得
  const expiration_year = $('[name="expiration_year"]').val();
  const expiration_month = $('[name="expiration_month"]').val();
  const plan = $('[name="plan"]').val();
  const atoken = $('[name="_token"]').val();
//   plan: 1000540330
// expiration_year: 2022
// expiration_month: 8

  Logger.log(expiration_year);
  Logger.log(expiration_month);
  Logger.log(plan);
  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]

    if (CookieUtil.getValue(cookie, 'denki_front_session')) {
      cookie_auth_session_id = CookieUtil.getValue(cookie, 'denki_front_session');
    }
  }
  headers = {
    'cookie': 'denki_front_session=' + cookie_auth_session_id + ';',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
  payload = { // リクエストパラメータ
    '_token': atoken,
  'plan': plan,
  'expiration_year': expiration_year,
  'expiration_month': 8,
  }
  options = {
    'method': 'post',
    'headers': headers,
    'payload': payload,
    'followRedirects': false,
    'muteHttpExceptions': false
  }

  // リクエスト送信
  url = 'https://looop-denki.com/mypage/invoice/detail/';
  Logger.log(url);
  response = UrlFetchApp.fetch(url, options);
  content = response.getContentText("UTF-8");



  cookies = response.getAllHeaders()["Set-Cookie"];
  for (const c in cookies) {
    const cookie = cookies[c]

    if (CookieUtil.getValue(cookie, 'denki_front_session')) {
      cookie_auth_session_id = CookieUtil.getValue(cookie, 'denki_front_session')
    }
  }

  Utilities.sleep(1000);

 content = response.getContentText("UTF-8");
  $ = cheerio.load(content);
  // 以下のパラメータはログインフォーム内に記載されているため取得
  const year = 2022;
  const month = 8;
  const contractId = plan;
  // Logger.log(year);
  // Logger.log(month);
  // Logger.log(contractId);

  headers = {
    'cookie': 'denki_front_session=' + cookie_auth_session_id + ';',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36'
  }
  options = {
    'method': 'get',
    'headers': headers,
    'followRedirects': false,
    'muteHttpExceptions': false
  }
  url = `https://looop-denki.com/mypage/invoice/detail/?year=${year}&month=${month}&contractId=${contractId}`;
  Logger.log(url);
  response = UrlFetchApp.fetch(url, options);

  content = response.getContentText("UTF-8");
  Logger.log(content);

  let s = Parser.data(content).from('<main>').to('</main').build();
   var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('loop電気');
  sheet.getRange("A3").setValue(s);


//PDF￥ダウンロード先
//<a class="c_btn1 _short p_mypage_detail__button" href="#"
                                //     onclick="window.open('https://looop-denki.com/mypage/invoice/show_billing_api_pdf/0300111060364216106091/202208/')">
                                //     <img src="/assets/images/pdf-icon.svg" alt="pdf" class="c_btn1__ico">
                                //     <span>PDFをダウンロード</span>
                                // </a>

    let t = Parser.data(s).from('<section>').to('</section>').iterate();



 
  // sheet.getRange("A4").setValue(t);



}