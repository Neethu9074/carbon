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
      setFreeTextFilter(transformToLuceneQuery(freeText));
    } catch (e) {
      // TODO proper error handling
      alert(e.message);
    }
  });

export function setInputString(newString) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(newString);
    return navParams;
  });
}
