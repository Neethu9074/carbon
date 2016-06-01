import {create} from 'reactive-observables';

export default function createDataSeriesFilterStore() {
  const filterChanges$ = create();
  const activeFilters$ = filterChanges$
    .scan((filters, toggeledFilter) => {
      if (filters[toggeledFilter]) {
        delete filters[toggeledFilter];
      } else {
        filters[toggeledFilter] = true;
      }
      return filters;
    }, Object.create(null))
    .startWith(Object.create(null));

  return {
    activeFilters$,
    toggleFilter: filterChanges$.emit.bind(filterChanges$)
  };
}
