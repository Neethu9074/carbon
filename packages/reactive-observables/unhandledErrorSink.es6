const msg = 'Unhandled error in observable chain';

let handler = error => {
  /*eslint-disable no-console, no-undef*/
  if (typeof console !== undefined) {
    if (console.error) {
      console.error(msg, error);
    } else if (console.log) {
      console.log(msg, error);
    }
  }
  /*eslint-enable no-console, no-undef*/
};

export function reportUnhandledError(error) {
  if (handler) {
    handler(error);
  }
}

export function setHandler(fn) {
  handler = fn;
}
