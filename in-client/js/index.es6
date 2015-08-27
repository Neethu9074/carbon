/*global require:false */
runWithPolyfills(() => {
  require('./init');
});

function runWithPolyfills(fn) {
  // Check if polyfill required
  if (!window.Intl) {
    // Webpack parses the inside of require([]) at build time to know that
    // intl should be bundled separately.
    require(['intl'], () => {
      fn();
    });
  } else {
    // Polyfill wasn't needed, carry on
    fn();
  }
}
