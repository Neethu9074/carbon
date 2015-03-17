'use strict';

import invariant from 'invariant';

const appenders = [];
const severities = {};
let activePrio = 0;

class Logger {
  constructor(name) {
    this.name = name;
  }
}

export function createLogger(name) {
  return new Logger(name);
}

addSeverity('trace', 10);
addSeverity('debug', 20);
addSeverity('info', 30);
addSeverity('warn', 40);
addSeverity('error', 50);

export function addSeverity(severity, prio) {
  invariant(
    !severities[severity],
    'Severity %s is already registered.',
    severity
  );

  severities[severity] = prio;
  Logger.prototype[severity] = function() {
    if (prio >= activePrio) {
      let params = [];
      for (let i = 0, len = arguments.length; i < len; i++) {
        params.push(arguments[i]);
      }
      log(severity, params);
    }
  };
}

function log(severity, params) {
  appenders.forEach(appender => appender(severity, params));
}

/*eslint-disable no-console */
if (typeof console !== 'undefined') {
  addAppender((severity, params) => {
    if (console[severity]) {
      console[severity].apply(console, params);
    } else {
      console.log('Level: %s', severity, params);
    }
  });
}
/*eslint-enable no-console */

export function addAppender(appender) {
  appenders.push(appender);
}

export function setActiveSeverity(severity) {
  invariant(severities[severity], 'Severity not found');
  activePrio = severities[severity];
}
