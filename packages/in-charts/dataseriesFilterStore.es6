import { createStore } from 'in-stores/store';

export default function createDataSeriesFilterStore() {
  const store = createStore({
    isGlobal: false,
    initialValue: {},
    reducers: {
      reduceTo(currentFilters, action) {
        const filteredResult = {};
        const keys = Object.keys(currentFilters);

        for (let iK = 0; iK < keys.length; iK++) {
          const key = keys[iK];
          for (let i = 0; i < action.ids.length; i++) {
            if (key.indexOf(action.ids[i]) === 0) {
              filteredResult[key] = true;
            }
          }
        }

        return filteredResult;
      },

      toggle(currentFilters, action) {
        if (currentFilters[action.toggeledFilter]) {
          delete currentFilters[action.toggeledFilter];
        } else {
          currentFilters[action.toggeledFilter] = true;
        }
        return currentFilters;
      }
    }
  });

  return {
    activeFilters$: store.observable,
    toggleFilter: toggeledFilter => store.applyStateMutation({ type: 'toggle', toggeledFilter }),
    reduceTo: ids => store.applyStateMutation({ type: 'reduceTo', ids })
  };
}
