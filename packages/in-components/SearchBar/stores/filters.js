/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { List } from 'immutable';
import React from 'react';

import { createLogger } from '@instana/logger';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import ConfirmationDialog from 'in-components/Dialog/ConfirmationDialog';
import { DFQ_FILTER_REMOVED } from 'in-services/tracking/eventNames';
import { getAllFilters, removeFilter } from 'in-api/filters';
import { track } from 'in-services/tracking/tracking';
import { createStore } from 'in-stores/store';
import { Trans, t } from 'in-i18n';

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
      header={t('in-components:searchBar.filterConfirmRemovalHeader')}
      description={
        <span>
          <Trans i18nKey="in-components:searchBar.filterConfirmRemoveMsg" values={{ filterName: name }} />
        </span>
      }
      confirmButtonLabel={t('in-components:searchBar.filterConfirmButtonLabel')}
      onSubmit={() => {
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
    />
  );
}
