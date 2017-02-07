/* eslint-disable no-console */

import './perfNowPolyfill';
import './defaultTimeout.es6';

if (!__DEV__) {
  console.log(
    '%c Questions about Instana? Contact us via support@instana.com!',
    'font-size: 14px; color: #172429; font-weight: bold;'
  );
}

/* global require:false */
runWithPolyfills(() => {
  require('./init');
});

function runWithPolyfills(fn) {
  // Including perf.now polyfill all the time since it is so small.
  // Intl polyfill removed since we aren't using it anyway.
  fn();
}
