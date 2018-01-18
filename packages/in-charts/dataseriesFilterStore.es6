import { generateUniqueShortId } from 'in-services/util/id';
import { createStore } from 'in-stores/store';

export default function createDataSeriesFilterStore() {
  const store = createStore({
    name: `chart/dataseriesFilterStore__` + generateUniqueShortId(),
    initialValue: {}
  });

  return {
    activeFilters$: store.observable,
    toggleFilter: toggeledFilter =>
      store.applyStateMutation(filters => {
        if (filters[toggeledFilter]) {
          delete filters[toggeledFilter];
        } else {
          filters[toggeledFilter] = true;
        }
        return filters;
      }),
    reduceTo: ids =>
      store.applyStateMutation(currentFilters => {
        const filteredResult = {};
        const keys = Object.keys(currentFilters);

        for (let iK = 0; iK < keys.length; iK++) {
          const key = keys[iK];
          for (let i = 0; i < ids.length; i++) {
            if (key.indexOf(ids[i]) === 0) {
              filteredResult[key] = true;
            }
          }
        }

        return filteredResult;
      })
  };
}
