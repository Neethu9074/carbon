import './perfNowPolyfill';
import './defaultTimeout.es6';

/* global require:false */
runWithPolyfills(() => {
  require('./init');
});

function runWithPolyfills(fn) {
  // Including perf.now polyfill all the time since it is so small.
  // Intl polyfill removed since we aren't using it anyway.
  fn();
}
