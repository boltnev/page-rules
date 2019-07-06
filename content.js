var storage = chrome.storage.local;

storage.get('items', function(items){
    if (!items.items){
        items.items = [];
    }
    window.existingItems = items.items;
    for(var i = 0; i < items.items.length; i++){
        // var k = items.items[i];
        let id = items.items[i];
        storage.get(id, function(rule){
          console.log(rule)

          for (var key in rule) {
              // Костыль из-за неудачной структуры данных
              if (rule.hasOwnProperty(key)) {
                //console.log(rule, key, rule[key]);
                if(rule[key] && rule[key].type === 'custom-css' && rule[key].enabled){
                    console.log("css rule", rule[key]);
                    if(window.location.href.match(rule[key].regex)){
                        console.log("matched", rule[key]);
                        $('head').append('<style>'+ rule[key].content+'</style>');
                    }
                }

              }
           }
        });
    };
});