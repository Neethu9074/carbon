/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { identity as identityFn } from 'in-services/util/function';

export const identity = {
  compact: identityFn,
  detailed: identityFn
};

/**
 * Uppercases the first letter of the string.
 */
export function capitalize(string: string): string {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function createFormatter(
  prefixRegexStr: string = '',
  suffixRegexStr: string = ''
): (formatString: string, replacements: string[]) => string {
  const regex = new RegExp(`{${prefixRegexStr}(\\d+)${suffixRegexStr}}`, 'g');
  return (formatString: string, replacements: string[]) => {
    return formatString.replace(regex, (match: string, number: number) => {
      if (replacements[number] !== undefined) {
        return replacements[number];
      }
      return match;
    });
  };
}
