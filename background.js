var storage = chrome.storage.local;

var bkg = chrome.extension.getBackgroundPage();

var cachedData = {}

// cache heater
setInterval(function(){
  storage.get('items', function(items){
      if (!items.items){
          items.items = [];
      }
      window.existingItems = items.items;
      for(var i = 0; i < items.items.length; i++){
          // var k = items.items[i];
          let id = items.items[i];
          storage.get(id, function(rule){
            for (var key in rule) {
                // Костыль из-за неудачной структуры данных
                if (rule.hasOwnProperty(key)) {
                  if(rule[key] && rule[key].type === 'custom-request-header' && rule[key].enabled){
                    console.log(rule)
                    cachedData[rule[key].regex] = rule[key];
                  }

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
      for (var key in cachedData) {
        // check if the property/key is defined in the object itself, not in parent
        if (cachedData.hasOwnProperty(key)) {
            rule = cachedData[key];
            console.log(rule);
            if(details.url.match(rule.regex)){
              //console.log("matched");
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
//bkg.console.log("INIT BACKGROUND SCRIPT");