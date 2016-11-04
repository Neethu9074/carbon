/**
 * Uppercases the first letter of the string.
 */
export function capitalize(string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}


export function parseLong(string) {
  return Number(Number(string).toFixed(0));
}


// shamelessly copied from
// http://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
export function hashCode(string) {
  let hash = 0;

  if (string == null) {
    return hash;
  }

  for (let i = 0, len = string.length; i < len; i++) {
    const chr = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
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
