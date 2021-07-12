/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';

import { activeLanguage } from 'in-i18n/language';

if (__DEV__) {
  invariant(activeLanguage, 'activeLanguage not defined. Did we establish a circular import problem?');
}

export function isBlank(s?: string) {
  return s == null || s.length === 0 || s.trim().length === 0;
}

export function isNotBlank(s?: string) {
  return !isBlank(s);
}

export const compare = new Intl.Collator(activeLanguage).compare;
export const compareIgnoreCase = new Intl.Collator(activeLanguage, { sensitivity: 'base' }).compare;

export function containsIgnoreCase(s: string, search: string) {
  return s.toLowerCase().indexOf(search.toLowerCase()) !== -1;
}

export function toTitleCase(s?: string) {
  if (s == null || typeof s !== 'string' || s.length < 2) {
    return s;
  }
  return s[0].toUpperCase() + s.substr(1).toLowerCase();
}

export function shorten(s?: string, maxLength = 64) {
  if (!s) {
    return s;
  }
  if (s.length <= maxLength) {
    return s;
  }
  return s.substring(0, maxLength) + '…';
}

export function removeBlankLines(s?: string) {
  if (!s) {
    return s;
  }

  return s
    .split('\n')
    .filter(isNotBlank)
    .join('\n');
}

const asciiAlphabetStart = 65;
export function getAThroughZRepresentation(n: number): string {
  const character = String.fromCharCode(asciiAlphabetStart + (n % 26));

  const remainder = parseInt(String(n / 26), 10);
  const requiresMoreCharacters = remainder > 0;

  if (requiresMoreCharacters) {
    return getAThroughZRepresentation(remainder - 1) + character;
  }

  return character;
}
