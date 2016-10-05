import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {mutateInputString} from 'in-stores/search';
import {focusedMoment$} from 'in-stores/timeline';


export const filterableTags$ = focusedMoment$.flatMap(createFilterableTagsObservable);


export function setEventTypeFilter(type) {
  removeEventTypeFilter();
  mutateInputString(inputString => {
    if (containsTagFilter(inputString, type)) {
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


// return new RegExp(`${type} *= *("([^"]+)"|([^\\s]+))`, 'ig').test(freeText);
export function containsTagFilter(freeText, type) {
  return getRegExpMachingTag(type).test(freeText);
}

function getRegExpMachingTag(type) {
  return new RegExp(`(^|\\s)type *= *("${type}"|${type})(\\s|$)`, 'ig');
}
