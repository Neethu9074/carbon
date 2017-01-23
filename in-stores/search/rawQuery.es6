import {mutateUrl, navigationParameters$} from 'in-stores/navigation';
import {createStore} from 'in-stores/store';

const rawQueryStore = createStore({
  name: 'search/rawQuery',
  value: ''
});
export const rawQuery$ = rawQueryStore.observable.distinct();


navigationParameters$
  .subscribe(params => {
    const query = params.query;
    if ('q' in query) {
      rawQueryStore.mutateTo(decodeURIComponent(query.q));
    } else {
      rawQueryStore.mutateTo('');
    }
  });

rawQuery$
  .skipFirst()
  .debounce(500)
  .subscribe(rawQuery => {
    mutateUrl(navParams => {
      navParams.query.q = encodeURIComponent(rawQuery);
      return navParams;
    });
  });


export function setInputString(newString) {
  rawQueryStore.mutateTo(newString);
}


export function mutateInputString(fn) {
  mutateUrl(navParams => {
    navParams.query.q = encodeURIComponent(fn(decodeURIComponent(navParams.query.q || '')));
    return navParams;
  });
}
