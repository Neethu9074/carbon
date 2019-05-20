// @flow
const msg = 'Unhandled error in observable chain';

let handler = (error: any): void => {
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

export function reportUnhandledError(error: any) {
  if (handler) {
    handler(error);
  }
}

export function setHandler(fn: (error: any) => void) {
  handler = fn;
}
