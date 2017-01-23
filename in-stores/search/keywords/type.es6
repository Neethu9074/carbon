import {mutateInputString} from 'in-stores/search/query';


export function setTypeFilter(type, negate = false) {
  mutateInputString(inputString => {
    const operator = negate ? '!=' : '=';
    inputString = removeExistingTypeFilter(inputString);
    return `${inputString} type${operator}"${type}"`.trim();
  });
}

export function removeTypeFilter() {
  mutateInputString(removeExistingTypeFilter);
}

function removeExistingTypeFilter(inputString) {
  return inputString.replace(/(^|\s)type *!?= *(("([^"]+)")|([^\s]+))/ig, ' ')
    // remove excess whitespace
    .replace(/ {2,}/ig, ' ')
    .trim();
}

export function containsTypeFilter(freeText, type, operator = '=') {
  return new RegExp(`(^|\\s)type *${operator} *("${type}"|${type})(\\s|$)`, 'ig').test(freeText);
}
