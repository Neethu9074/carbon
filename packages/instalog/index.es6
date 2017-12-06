import invariant from 'invariant';
import Logger from './Logger';

export { ConsoleAppender } from './ConsoleAppender';

const appenders = [];
// severity name (string) => priority (number)
const severities = {};

addSeverity('trace', 10);
addSeverity('debug', 20);
addSeverity('info', 30);
addSeverity('warn', 40);
addSeverity('error', 50);

export function addSeverity(severity, priority) {
  invariant(!severities[severity], 'Severity %s is already registered.', severity);

  severities[severity] = priority;
  Logger.prototype[severity] = function() {
    var params = [];
    for (var i = 0, len = arguments.length; i < len; i++) {
      params.push(arguments[i]);
    }
    log({
      name: this.name,
      severity: severity,
      params: params
    });
  };
}

function log(opts) {
  var priority = severities[opts.severity];
  for (var i = 0; i < appenders.length; i++) {
    var appender = appenders[i];
    if (priority >= appender.getActivePriority()) {
      appender.append(opts);
    }
  }
}

export function createLogger(name) {
  return new Logger(name);
}

export function addAppender(appender) {
  appenders.push(appender);
}
