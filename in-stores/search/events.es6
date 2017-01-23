import {mutateInputString} from 'in-stores/search/rawQuery';


export function setEventTypeFilter(type) {
  removeEventTypeFilter();
  mutateInputString(inputString => {
    if (containsEventTypeFilter(inputString, type)) {
      return inputString;
    }

    return `${inputString} type="${type}"`.trim();
  });
}

export function removeEventTypeFilter() {
  mutateInputString(inputString => {
    return inputString.replace(/(^|\s)type *= *(("([^"]+)")|([^\s]+))/ig, ' ')
      // remove excess whitespace
      .replace(/ {2,}/ig, ' ')
      .trim();
  });
}

export function containsEventTypeFilter(freeText, type) {
  return getRegExpMachingEventType(type).test(freeText);
}

function getRegExpMachingEventType(type) {
  return new RegExp(`(^|\\s)type *= *("${type}"|${type})(\\s|$)`, 'ig');
}
