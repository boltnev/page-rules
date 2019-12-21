var storage = chrome.storage.local;

window.onload = function(){
  //storage.clear();
  storage.get('items', function(items){
    console.log("loading completed", items)
    if (!items.items){
      items.items = [];
    }
    window.existingItems = items.items;
    for(var i = 0; i < items.items.length; i++){
      let id = items.items[i];
      storage.get(id, function(card){
        console.log(card);
        var cardDiv = $('#new').clone();
        cardDiv.attr('id', id);
        cardDiv.find('.options-header').html(card[id].title);
        cardDiv.find('.options-body__submit').html("SAVE");
        cardDiv.find('[name=title]').val(card[id].title);
        cardDiv.find('[name=regex]').val(card[id].regex);
        cardDiv.find('[name=enabled]')[0].checked = card[id].enabled;
        cardDiv.find('[name=type]').val(card[id].type);
        cardDiv.find('[name=content]').val(card[id].content);
        cardDiv.insertBefore($('#new'));
        cardDiv.find(".options-body__submit").click(save);
        cardDiv.find('form').append('<button class=".options-body__submit button-delete">DELETE</button>')
        cardDiv.find(".button-delete").click(remove);
      });
    };
  });
  console.log(window.existingItems);
  if(!window.existingItems){
    window.existingItems = [];
  };

  $(".options-body__submit").click(save);
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}


function save(e) {
    e.preventDefault();
    console.log("Pressed");
    var card = e.target.parentNode.parentNode;
    console.log(card.id);
    var title = $(card).find('[name=title]').val();
    var enabled = $(card).find('[name=enabled]')[0].checked;
    var type = $(card).find('[name=type]').val();
    var content = $(card).find('[name=content]').val();
    var regex = $(card).find('[name=regex]').val();

    if(card.id === "new"){
      var id = makeid(32);
      var obj = {};
      obj[id] = {title: title, enabled:enabled, type:type, content: content, regex:regex};
      existingItems.push(id);
      storage.set({'items': existingItems});
      storage.set(obj, function(){
        console.log("new item added", obj);
      });
    } else if (card.id != '') {
      var obj = {};
      obj[card.id] = {title: title, enabled:enabled, type:type, content: content, regex:regex};
      storage.set(obj, function(){
        console.log("updated item", obj);
      });
    }
    window.location.reload();
}

function remove(e) {
    e.preventDefault();
    console.log("Delete Pressed");
    var card = e.target.parentNode.parentNode;
    console.log(card.id);

    if (card.id != '' && card.id != "new") {
      storage.remove(card.id, function(){
        console.log("removed item", obj);
      });
    }
    window.location.reload();
}
