import {user, role} from 'in-stores/user';
import http from 'in-services/http';

let totalNumberOfReportedErrors = 0;

export default class UiTrackerLogAppender {

  constructor() {
    this.activePriority = 0;
  }

  append(opts) {
    // lots of stuff seems to go wrong, stop polluting our logs
    if (totalNumberOfReportedErrors >= 5) {
      return;
    }
    const formattedPayload = opts.params
      .map(part => {
        if (part instanceof Error) {
          return JSON.stringify({
            type: 'error',
            message: part.message,
            stack: part.stack
          }, 0, 2);
        } else if (typeof part === 'object') {
          return JSON.stringify(part, 0, 2);
        }

        return part;
      })
      .join('\n');

    const message = {
      logger: opts.name,
      user: {
        fullName: user.fullName,
        email: user.email,
        activeRole: role
      },
      version: window.instana.build,
      url: window.location.href,
      userAgent: window.navigator.userAgent,
      platform: window.navigator.platform,
      level: opts.severity,
      message: formattedPayload,
      serverTimeInClient: window.instana.dev.storeStates.serverTime
    };

    const error = opts.params.filter(p => p instanceof Error)[0];
    if (error) {
      message.error = {
        message: error.message,
        stack: error.stack
      };
    }

    // Best effort: Try to report errors to the server, but do not annoy the
    // user when it does not work.
    http({
      method: 'POST',
      url: '/uiTracker/log',
      data: message
    })
    // ignore all errors
    .errors()
    .subscribe(() => {});

    totalNumberOfReportedErrors++;
  }

  getActivePriority() {
    return this.activePriority;
  }

  setActivePriority(priority) {
    this.activePriority = priority;
  }

}
