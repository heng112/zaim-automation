const CONSUMER_KEY = new config().customerKey();
const CONSUMER_SECRET = new config().customerSecret();
/**
 * Authorizes and makes a request to the Zaim API.
 */
function run() {
  var service = getService();
  if (service.hasAccess()) {
    let url = 'https://api.zaim.net/v2/home/money';
    const response = service.fetch(url, {
      method: 'get'
    });
    const result = JSON.parse(response.getContentText());
    Logger.log(JSON.stringify(result, null, 2));
  } else {
    var authorizationUrl = service.authorize();
    Logger.log('次のURLを開いてZaimで認証したあと、再度スクリプトを実行してください。: %s',
        authorizationUrl);
  }
} 

function reset() {
  const service = getService();
  service.reset();
}

/**
 * Configures the service.
 */
function getService() {
  return OAuth1.createService('Zaim')
      // Set the endpoint URLs.
      .setAccessTokenUrl('https://api.zaim.net/v2/auth/access')
      .setRequestTokenUrl('https://api.zaim.net/v2/auth/request')
      .setAuthorizationUrl('https://auth.zaim.net/users/auth')

      // Set the consumer key and secret.
      .setConsumerKey(CONSUMER_KEY)
      .setConsumerSecret(CONSUMER_SECRET)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
 * Handles the OAuth callback.
 */
function authCallback(request) {
  const service = getService();
  const authorized = service.handleCallback(request);
  if (authorized) {
    return HtmlService.createHtmlOutput('認証できました！このページを閉じて再びスクリプトを実行してください。');
  } else {
    return HtmlService.createHtmlOutput('認証に失敗');
  }
}