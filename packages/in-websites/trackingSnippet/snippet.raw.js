/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable */

// This is the source version which we are using to generate the minified snippet. It is a partially
// manual process. To generate the minified snippet…
//
// 1. Edit this snippet as necessary
// 2. Make sure you raise the version number on globalApi['v']
// 2. Put it into Closure compiler advanced mode compilation with disabled pretty printing
//
// Closure compiler web services exist which can be used:
// https://closure-compiler.appspot.com/home

(function(win, longGlobalName, shortGlobalName, globalApi) {
  if (win[longGlobalName]) {
    return;
  }

  win[longGlobalName] = shortGlobalName;
  globalApi = win[shortGlobalName] = function() {
    globalApi['q'].push(arguments);
  };
  globalApi['q'] = [];
  globalApi['v'] = 2;
  globalApi['l'] = 1 * new Date();
})(window, 'InstanaEumObject', 'ineum');
