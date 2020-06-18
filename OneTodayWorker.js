addEventListener('fetch', event => {
  var promise = proxy(event);
  var oneHtml = event.respondWith(promise);
});

async function proxy(event) {

  const getReqHeader = (key) => event.request.headers.get(key);

  let url = new URL(event.request.url);
  url.protocol = "http:";
  url.hostname = "m.wufazhuce.com";
  url.href += "one";
  let parameter = {
    headers: {
      'Host': 'm.wufazhuce.com',
      'User-Agent': getReqHeader("User-Agent"),
      'Accept': getReqHeader("Accept"),
      'Accept-Language': getReqHeader("Accept-Language"),
      'Accept-Encoding': getReqHeader("Accept-Encoding"),
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Content-Type': 'application/text'
    }
  };

  if (event.request.headers.has("Referer")) {
    parameter.headers.Referer = getReqHeader("Referer");
  }

  if (event.request.headers.has("Origin")) {
    parameter.headers.Origin = getReqHeader("Origin");
  }

  
  var promise = fetch(new Request(url, event.request), parameter);
  return getOneToday(event, promise);
  
}

async function getOneToday(event, promise){

  let COOKIE = '';
  let TOKEN = '';
  let apiUrl = new URL(event.request.url);
  apiUrl.protocol = "http:";
  apiUrl.hostname = "m.wufazhuce.com";

  let apiParameter = {
    headers: {
      'Host': 'm.wufazhuce.com',
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Cookie': COOKIE
    }
  };

  return promise.then( res => {
        COOKIE = res.headers.get('Set-Cookie');
        apiParameter.headers.Cookie = COOKIE;
        return res.text();
  }).then( htmlStr => {
      TOKEN = htmlStr.split("One.token = '")[1].split("'")[0];
      apiUrl.href += "one/ajaxlist/0?_token="+TOKEN;
  }).then( () => {
    let promise = fetch(new Request(apiUrl, event.request), apiParameter);
    return promise;
  }).then( res => {
    let h = new Headers(res.headers);
      h.set('set-cookie', '');
      h.set('access-control-allow-origin', '*');
      h.set('access-control-expose-headers', '*');
      return new Response(res.body, {
          status: res.status,
          headers: h,
      });
  });

}