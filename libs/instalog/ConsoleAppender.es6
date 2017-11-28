/*eslint-disable no-console */

export class ConsoleAppender {
  constructor() {
    this.activePriority = 0;
  }

  append(opts) {
    var msg = ['[' + opts.severity + ']', opts.name, '::'].concat(opts.params);
    if (console[opts.severity]) {
      console[opts.severity].apply(console, msg);
    } else {
      console.log.apply(console, msg);
    }
  }

  getActivePriority() {
    return this.activePriority;
  }

  setActivePriority(priority) {
    this.activePriority = priority;
  }

  static isPossible() {
    return typeof console !== 'undefined';
  }
}

/*eslint-enable no-console */
