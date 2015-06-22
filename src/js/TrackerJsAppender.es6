/*global trackJs:false */

'use strict';

export default class TrackerJsAppender {

  constructor() {
    this.activePriority = 0;
  }

  append(opts) {
    const msg = [
      '[' + opts.severity + ']',
      opts.name,
      '::'
    ].concat(opts.params)
    .map(part => {
      if (typeof part === 'object') {
        return JSON.stringify(part, 0, 2);
      } else {
        return part;
      }
    })
    .join('\n');

    if (trackJs.console[opts.severity]) {
      trackJs.console[opts.severity](msg);
    } else {
      trackJs.track(msg);
    }

    trackJs.track(msg);
  }

  getActivePriority() {
    return this.activePriority;
  }

  setActivePriority(priority) {
    this.activePriority = priority;
  }

}
