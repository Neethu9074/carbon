'use strict';

import {send} from 'in-services/connection';

export default class UiBackendLogAppender {

  constructor() {
    this.activePriority = 0;
  }

  append(opts) {
    const formattedPayload = opts.params
      .map(part => {
        if (typeof part === 'object') {
          return JSON.stringify(part, 0, 2);
        } else {
          return part;
        }
      })
      .join('\n');

    const message = {
      event: 'log',
      logger: opts.name,
      user: window.navigator.userAgent,
      url: window.location.href,
      level: opts.severity,
      msg: formattedPayload
    };

    send(message);
  }

  getActivePriority() {
    return this.activePriority;
  }

  setActivePriority(priority) {
    this.activePriority = priority;
  }

}
