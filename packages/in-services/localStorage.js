/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

function isLocalStorageNameSupportedFn() {
  var testKey = 'test';

  // Apparently this is by design. When Safari (OS X or iOS) is in private browsing mode,
  // it appears as though localStorage is available, but trying to call setItem throws an exception.
  try {
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

const isLocalStorageNameSupported = isLocalStorageNameSupportedFn();

export function trySet(key, value) {
  if (isLocalStorageNameSupported) {
    localStorage.setItem(key, value);
  }
}

export function tryGet(key) {
  if (isLocalStorageNameSupported) {
    return localStorage.getItem(key);
  }
  return null;
}
