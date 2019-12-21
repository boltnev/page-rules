var storage = chrome.storage.local;

var bkg = chrome.extension.getBackgroundPage();

var cachedData = {
  'custom-request-header': {},
  'custom-response-header': {},
};

// cache heater
setInterval(function(){
  var _cachedDataRequest = {};
  var _cachedDataResponse = {};
  storage.get('items', function(items){
      if (!items.items){
          items.items = [];
      }
      for(var i = 0; i < items.items.length; i++){
          // var k = items.items[i];
          var id = items.items[i];
          storage.get(id, function(rule){
            for (var key in rule) {
                // Костыль из-за неудачной структуры данных
                  if (rule.hasOwnProperty(key)) {
                    if(rule[key] && rule[key].type === 'custom-request-header' && rule[key].enabled){
                      _cachedDataRequest[rule[key].regex] = rule[key];
                    }
                    if(rule[key] && rule[key].type === 'custom-response-header' && rule[key].enabled){
                      _cachedDataResponse[rule[key].regex] = rule[key];
                    }
                  }
                if(i == items.items.length){
                  cachedData['custom-request-header'] = _cachedDataRequest;
                  cachedData['custom-response-header'] = _cachedDataResponse;
                  console.log(cachedData);
                }
            }
          });
      };
  });
}, 2000);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
      bkg.console.log(details);

      //if(details.url.match(rule[_tmp_id].regex)){
      //}
      var requestRules = cachedData['custom-request-header'];
      for (var key in requestRules) {
        // check if the property/key is defined in the object itself, not in parent
        if (requestRules.hasOwnProperty(key)) {
            rule = requestRules[key];
            if(details.url.match(rule.regex)){
              console.log("matched", details.requestHeaders);
              headers = rule.content.split('\n');
              for(var i = 0; i < headers.length; i++){
                header = headers[i].split(":");
                details.requestHeaders.push({'name': header[0].trim(), 'value': header[1].trim()});
              }
            }
        }
      }
      return { requestHeaders: details.requestHeaders };
    },
    {urls: ['<all_urls>']},
    [ 'blocking', 'requestHeaders', 'extraHeaders']
);


chrome.webRequest.onHeadersReceived.addListener(
    function(details) {
      bkg.console.log(details);

      //if(details.url.match(rule[_tmp_id].regex)){
      //}
      //cachedData['custom-response-header'];
      var responseRules = cachedData['custom-response-header'];
      for (var key in responseRules) {
        // check if the property/key is defined in the object itself, not in parent
        if (responseRules.hasOwnProperty(key)) {
            rule = responseRules[key];
            if(details.url.match(rule.regex)){
              console.log("matched", details.responseHeaders);
              headers = rule.content.split('\n');
              for(var i = 0; i < headers.length; i++){
                header = headers[i].split(":");
                details.responseHeaders.push({'name': header[0].trim(), 'value': header[1].trim()});
              }
            }
        }
      }
      return { responseHeaders: details.responseHeaders };
    },
    {urls: ['<all_urls>']},
    [ 'blocking', 'responseHeaders', 'extraHeaders']
);
//bkg.console.log("INIT BACKGROUND SCRIPT");