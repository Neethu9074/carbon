/*global require:false */

'use strict';

runWithPolyfills(() => {
  require('./init');
});

function runWithPolyfills(fn) {
  // Check if polyfill required
  if (!window.Intl) {
    // Webpack parses the inside of require([]) at build time to know that
    // intl should be bundled separately. You could get the same effect by
    // passing ['intl'] as the first argument.
    require(['intl'], () => {
      fn();
    });
  } else {
    // Polyfill wasn't needed, carry on
    fn();
  }
}
