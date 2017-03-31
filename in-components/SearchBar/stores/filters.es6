import { createLogger } from 'instalog';
import { List } from 'immutable';
import React from 'react';

import { getAllFilters, removeFilter } from 'in-services/groundskeeper/filters';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { createStore } from 'in-stores/store';

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

export function remove(id, name) {
  setActiveDialog(
    <ConfirmationDialog
      header="Confirm removal"
      description={
        <span>
          Are you sure you want to remove the filter <strong>{name}</strong>?
        </span>
      }
      bButtonLabel="Remove filter"
      onB={() => {
        close();
        const result$ = removeFilter(id);

        result$.once(() => {
          errorStore.mutateTo(null);
          refresh();
        });

        result$.errors().once(error => {
          logger.error(`Failed to remove filter ${id}: ${error.message}`, error);
          errorStore.mutateTo('Failed to remove filter.');
        });
      }}
    />
  );
}
