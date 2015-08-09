

import * as time from 'in-services/time';

window.instana.dev = window.instana.dev || {};

setInterval(() => {
  const now = Date.now();
  window.instana.dev.time = {
    offset: time.getOffset(),
    localTime: now,
    serverTime: time.toServerTime(now)
  };
}, 1000);
