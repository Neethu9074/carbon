/**
 * A Logger is an object that is created via the
 * following constructor function. This simplifies
 * debugging. Logging methods are added in the
 * index.js file.
 *
 * @param {String} name The name of the logger as
 *  visible in log messages.
 */
export default class Logger {
  constructor(name) {
    this.name = name;
  }
}
