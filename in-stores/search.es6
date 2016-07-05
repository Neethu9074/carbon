/* eslint-disable no-alert */

import {combineLatest} from 'reactive-observables';
import Immutable from 'immutable';

import createFilterableTagsObservable from 'in-services/subscription/filterableTags';
import {transformToLuceneQuery, getTagFiltersFromQuery} from 'in-services/search';
import createSearchSubscription from 'in-services/subscription/search';
import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createStore, createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';
import {focusedMoment$} from 'in-stores/timeline';

export const rawQuery$ = createTrackingStore({
  name: 'in-stores/search/inputString',
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


const luceneQueryStore = createStore({
  name: 'in-stores/search/luceneQuery',
  initialValue: ''
});
export const luceneQuery$ = luceneQueryStore.observable;


const lastQueryChangeTime = createStore({
  name: 'in-stores/search/lastQueryChangeTime',
  initialValue: 0
});
export const lastQueryChangeTime$ = lastQueryChangeTime.observable;
luceneQuery$.subscribe(() => lastQueryChangeTime.applyStateMutation(() => Date.now()));


export const searchMatches$ = createTrackingStore({
  name: 'in-stores/search/searchMatches',
  observable: combineLatest([luceneQuery$, focusedMoment$])
    .flatMap(([luceneQuery, focusedMoment]) => {
      if (luceneQuery == null || luceneQuery.length === 0) {
        return alwaysNull;
      }

      return createSearchSubscription({
        query: luceneQuery,
        time: focusedMoment,
        view: 'PHYSICAL'
      });
    })
}).observable;


const errorStore = createStore({
  name: 'in-stores/search/queryTranslationError',
  initialValue: ''
});

export const error$ = errorStore.observable;

rawQuery$
  .debounce(500)
  .subscribe(freeText => {
    try {
      const luceneQuery = transformToLuceneQuery(freeText);
      errorStore.applyStateMutation(() => null);
      luceneQueryStore.applyStateMutation(() => luceneQuery);
    } catch (e) {
      errorStore.applyStateMutation(() => e.message);
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
