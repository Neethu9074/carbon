import { createLogger } from 'instalog';
import { List } from 'immutable';
import React from 'react';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { DFQ_FILTER_REMOVED } from 'in-services/tracking/eventNames';
import { getAllFilters, removeFilter } from 'in-api/filters';
import { track } from 'in-services/tracking/tracking';
import { createStore } from 'in-stores/store';

const logger = createLogger('SearchBar/stores/filters');

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

export function remove(id, name, definition) {
  addActiveDialog(
    <ConfirmationDialog
      header="Confirm Removal"
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
          track(DFQ_FILTER_REMOVED, { name, query: definition });
          errorStore.mutateTo(null);
          refresh();
        });

        result$.errors().once(error => {
          logger.error(`Failed to remove filter ${id}: ${error.message}`, error);
          errorStore.mutateTo('Failed to remove filter.');
        });
      }}
      bButtonIcon="lib_actions_delete"
    />
  );
}
