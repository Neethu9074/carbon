import Immutable from 'immutable';

import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {rawQuery$, mutateInputString} from 'in-stores/search/rawQuery';
import {getTagFiltersFromQuery} from 'in-services/search';
import {focusedMoment$} from 'in-stores/timeline';

// A stream of the form ImmutableSet<String> describing the currently active
// tag filters.
export const filteredTags$ = rawQuery$.map(rawQuery => {
  return Immutable.Set(getTagFiltersFromQuery(rawQuery));
});

export const filterableTags$ = focusedMoment$.flatMap(createFilterableTagsObservable);


export function addTagFilter(tag) {
  mutateInputString(inputString => {
    if (containsTagFilter(inputString, tag)) {
      return inputString;
    }

    return `${inputString} tag="${tag}"`.trim();
  });
}


export function removeTagFilter(tag) {
  mutateInputString(inputString => {
    if (!containsTagFilter(inputString, tag)) {
      return inputString;
    }

    return inputString.replace(getRegExpMachingTag(tag), ' ')
      // remove excess whitespace
      .replace(/ {2,}/ig, ' ')
      .trim();
  });
}


export function removeAllTagFilters() {
  mutateInputString(inputString => {
    return inputString.replace(/(^|\s)tag *= *(("([^"]+)")|([^\s]+))/ig, ' ')
      // remove excess whitespace
      .replace(/ {2,}/ig, ' ')
      .trim();
  });
}

// return new RegExp(`${tag} *= *("([^"]+)"|([^\\s]+))`, 'ig').test(freeText);
export function containsTagFilter(freeText, tag) {
  return getRegExpMachingTag(tag).test(freeText);
}


function getRegExpMachingTag(tag) {
  return new RegExp(`(^|\\s)tag *= *("${tag}"|${tag})(\\s|$)`, 'ig');
}
