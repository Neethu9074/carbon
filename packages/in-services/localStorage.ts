/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useEffect, useState } from 'react';

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

/**
 * Function to use localstorage using a hook (It works like you would use a state)
 * @param key Key to retrieve the data
 * @param initialValue initial value stored in localstorage
 * @returns [ current value, setter function]
 */
export const useLocalStorage = (key: string, initialValue: any) => {
  const [value, setValue] = useState(() => {
    return JSON.parse(tryGet(key) as string) || initialValue;
  });

  useEffect(() => {
    trySet(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};
