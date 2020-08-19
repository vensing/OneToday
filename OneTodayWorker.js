
addEventListener('fetch', event => {
  event.respondWith(proxy(event));
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

  const response = await fetch(new Request(url), parameter);
  const COOKIE = response.headers.get('Set-Cookie');
  
  const htmlStr = await response.text();
  const TOKEN = htmlStr.split("One.token = '")[1].split("'")[0];
  let apiUrl = new URL(event.request.url);
  apiUrl.protocol = "http:";
  apiUrl.hostname = "m.wufazhuce.com";
  apiUrl.href += "one/ajaxlist/0?_token="+TOKEN;
  let apiParameter = {
    headers: {
      'Host': 'm.wufazhuce.com',
      'User-Agent': getReqHeader("User-Agent"),
      'Accept': getReqHeader("Accept"),
      'Accept-Language': getReqHeader("Accept-Language"),
      'Accept-Encoding': getReqHeader("Accept-Encoding"),
      'Connection': 'keep-alive',
      'Cache-Control': 'max-age=0',
      'Cookie': COOKIE
    }
  };

  const resultResponse = await fetch(new Request(apiUrl), apiParameter);
  let resultHeader = new Headers(resultResponse.headers);
  resultHeader.set('set-cookie', '');
  resultHeader.set('access-control-allow-origin', '*');
  resultHeader.set('access-control-expose-headers', '*');

  return new Response(resultResponse.body, {
      status: resultResponse.status,
      headers: resultHeader
  });
  
}
