// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Store CSS data in the "local" storage area.
//
// See note in options.js for rationale on why not to use "sync".
var storage = chrome.storage.local;

var message = document.querySelector('#message');

var optionsUrl = chrome.extension.getURL('options.html');
message.innerHTML = 'Set up page rules on the <a target="_blank" href="' +
    optionsUrl + '">options page</a> first.';
