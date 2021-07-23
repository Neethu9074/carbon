/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

function isLocalStorageSupportedFn() {
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

const isLocalStorageSupported = isLocalStorageSupportedFn();

export function trySet(key: string, value: string) {
  if (isLocalStorageSupported) {
    localStorage.setItem(key, value);
  }
}

export function tryGet(key: string): string | null {
  if (isLocalStorageSupported) {
    return localStorage.getItem(key);
  }
  return null;
}
