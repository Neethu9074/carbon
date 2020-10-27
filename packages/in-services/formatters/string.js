import { identity as identityFn } from 'in-services/util/function';

export const identity = {
  compact: identityFn,
  detailed: identityFn
};

/**
 * Uppercases the first letter of the string.
 */
export function capitalize(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

export function createFormatter(prefixRegexStr = '', suffixRegexStr = '') {
  const regex = new RegExp(`{${prefixRegexStr}(\\d+)${suffixRegexStr}}`, 'g');
  return (formatString, replacements) => {
    return formatString.replace(regex, (match, number) => {
      if (replacements[number] !== undefined) {
        return replacements[number];
      }
      return match;
    });
  };
}
