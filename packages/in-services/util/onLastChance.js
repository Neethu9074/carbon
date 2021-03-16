/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

let isUnloading = false;

export function onLastChance(fn) {
  if (isUnloading) {
    fn();
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') {
      fn();
    }
  });

  window.addEventListener('pagehide', event => {
    if (event.persisted) {
      isUnloading = true;
      fn();
    }
  });

  // Unload is needed to fix this bug:
  // https://bugs.chromium.org/p/chromium/issues/detail?id=987409
  window.addEventListener('unload', () => {});

  // According to the spec visibilitychange should be a replacement for
  // beforeunload, but the reality is different (as of 2019-04-17). Chrome will
  // close tabs without firing visibilitychange. beforeunload on the other hand
  // is fired.
  window.addEventListener('beforeunload', () => {
    isUnloading = true;
    fn();
  });
}
