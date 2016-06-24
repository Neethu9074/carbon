/* eslint-disable no-alert */

import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createTrackingStore} from 'in-stores/store';
import {setFreeTextFilter} from 'in-stores/filtering';
import {transformToLuceneQuery} from 'in-services/search';

export const inputString$ = createTrackingStore({
    name: 'SearchBar/inputString',
    observable: navigationParameters$
      .map(params => {
        const query = params.query;
        if ('q' in query) {
          return decodeURIComponent(query.q);
        }

        return '';
      })
      .distinct()
  }).observable;

inputString$
  .debounce(300)
  .subscribe(freeText => {
    try {
      setFreeTextFilter(transformToLuceneQuery(freeText), freeText);
    } catch (e) {
      // TODO proper error handling
      console.error(e.message);
    }
  });

export function setInputString(newString) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(newString);
    return navParams;
  });
}


function mutateInputString(fn) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(fn(decodeURIComponent(navParams.query.q || '')));
    return navParams;
  });
}


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
