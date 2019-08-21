/* eslint-disable */

// This is the source version which we are using to generate the minified snippet. It is a partially
// manual process. To generate the minified snippet…
//
// 1. Edit this snippet as necessary
// 2. Put it into Closure compiler advanced mode compilation with disabled pretty printing
//
// Closure compiler web services exist which can be used:
// https://closure-compiler.appspot.com/home

(function(
  win,
  doc,
  scriptTagName,
  scriptSourceUrl,
  longGlobalName,
  shortGlobalName,
  globalApi,
  scriptTag,
  prevScriptTag
) {
  if (win[longGlobalName]) {
    return;
  }

  win[longGlobalName] = shortGlobalName;
  globalApi = win[shortGlobalName] = function() {
    globalApi['q'].push(arguments);
  };
  globalApi['q'] = [];
  globalApi['l'] = 1 * new Date();

  scriptTag = doc.createElement(scriptTagName);
  scriptTag.async = 1;
  scriptTag.src = scriptSourceUrl;
  scriptTag.setAttribute('crossorigin', 'anonymous');

  prevScriptTag = doc.getElementsByTagName(scriptTagName)[0];
  prevScriptTag.parentNode.insertBefore(scriptTag, prevScriptTag);
})(window, document, 'script', '//eum.instana.io/eum.min.js', 'InstanaEumObject', 'ineum');
