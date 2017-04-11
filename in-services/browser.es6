import { create, on } from 'reactive-observables';

export const resize$ = create();
export const debouncedResize$ = resize$.debounce(300);

export function init() {
  const browser = getBrowser();
  if (browser) {
    document.documentElement.classList.add('in-browser-' + browser);
  }

  on(window, 'resize').subscribe(emitResizeEvent);
}

export function emitResizeEvent() {
  resize$.emit(true);
}

// We only need an approximate match for a few browser categories. Note that this only
// covers a very limited set of user agent strings and is far from a complete library.
//
// We are doing this ourselves instead of adding a library to implement this as most
// libraries for this are huge as they try to detect all possible browsers (most of which we do
// not give a fuck about).
//
// User agent string source:
// http://www.useragentstring.com/
function getBrowser() {
  const ua = window.navigator.userAgent;
  if (/Edge/.test(ua)) {
    return 'edge';
  } else if (/Chrome/i.test(ua)) {
    return 'chrome';
  } else if (/Safari/i.test(ua)) {
    return 'safari';
  } else if (/Firefox/i.test(ua)) {
    return 'ff';
  } else if (/Trident/i.test(ua)) {
    return 'ie';
  }

  return null;
}

export function isSafari() {
  return getBrowser() === 'safari';
}
