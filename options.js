// // Copyright (c) 2012 The Chromium Authors. All rights reserved.
// // Use of this source code is governed by a BSD-style license that can be
// // found in the LICENSE file.
// 
// // Store CSS data in the "local" storage area.
// //
// // Usually we try to store settings in the "sync" area since a lot of the time
// // it will be a better user experience for settings to automatically sync
// // between browsers.
// //
// // However, "sync" is expensive with a strict quota (both in storage space and
// // bandwidth) so data that may be as large and updated as frequently as the CSS
// // may not be suitable.
// var storage = chrome.storage.local;
// 
// // Get at the DOM controls used in the sample.
// var resetButton = document.querySelector('button.reset');
// var submitButton = document.querySelector('button.submit');
// var textarea = document.querySelector('textarea');
// 
// // Load any CSS that may have previously been saved.
// loadChanges();
// 
// submitButton.addEventListener('click', saveChanges);
// resetButton.addEventListener('click', reset);
// 
// function saveChanges() {
//   // Get the current CSS snippet from the form.
//   var cssCode = textarea.value;
//   // Check that there's some code there.
//   if (!cssCode) {
//     message('Error: No CSS specified');
//     return;
//   }
//   // Save it using the Chrome extension storage API.
//   storage.set({'css': cssCode}, function() {
//     // Notify that we saved.
//     message('Settings saved');
//   });
// }
// 
// function loadChanges() {
//   storage.get('css', function(items) {
//     // To avoid checking items.css we could specify storage.get({css: ''}) to
//     // return a default value of '' if there is no css value yet.
//     if (items.css) {
//       textarea.value = items.css;
//       message('Loaded saved CSS.');
//     }
//   });
// }
// 
// function reset() {
//   // Remove the saved value from storage. storage.clear would achieve the same
//   // thing.
//   storage.remove('css', function(items) {
//     message('Reset stored CSS');
//   });
//   // Refresh the text area.
//   textarea.value = '';
// }
// 
// function message(msg) {
//   var message = document.querySelector('.message');
//   message.innerText = msg;
//   setTimeout(function() {
//     message.innerText = '';
//   }, 3000);
// }
//

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
