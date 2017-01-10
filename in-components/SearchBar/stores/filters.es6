import {List} from 'immutable';

import {getAllFilters, removeFilter} from 'in-services/groundskeeper/filters';
import {createStore} from 'in-stores/store';
import {createLogger} from 'instalog';

const logger = createLogger('SearchBar/stores/filers');

const filtersStore = createStore({
  name: 'in-components/SearchBar/stores/filters',
  initialValue: List()
});
export const filters$ = filtersStore.observable;

const errorStore = createStore({
  name: 'in-components/SearchBar/stores/filters/error',
  initialValue: null
});
export const error$ = errorStore.observable;


export function refresh() {
  const result$ = getAllFilters();

  result$.once(filters => {
    filtersStore.mutateTo(filters);
    errorStore.mutateTo(null);
  });

  result$.errors().once(error => {
    logger.error(`Failed to retrieve filters: ${error.message}`, error);
    errorStore.mutateTo('Failed to retrieve filters.');
  });
}


export function remove(id) {
  const result$ = removeFilter(id);

  result$.once(() => {
    errorStore.mutateTo(null);
    refresh();
  });

  result$.errors().once(error => {
    logger.error(`Failed to remove filter ${id}: ${error.message}`, error);
    errorStore.mutateTo('Failed to remove filter.');
  });
}
