/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { escapeRegExp } from 'lodash';

export function getFuzzyMatchingRegex(valueFilter: string) {
  return new RegExp(
    valueFilter
      .split('')
      .map(escapeRegExp)
      .join('.*'),
    'i'
  );
}
