/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';
import { get } from 'lodash';

import { add as addApi, remove as removeApi } from 'in-stores/starredItems/api';
import { noop } from 'in-services/util/function';
import { createStore } from 'in-stores/store';

const logger = createLogger('in-stores/starredItems/store');

const store = createStore({
  initialValue: Array.isArray(get(window, ['instana', 'starredItems'])) ? get(window, ['instana', 'starredItems']) : []
});

export const starredItems$ = store.observable;

export function add(starredItem) {
  store.applyStateMutation(starredItems => starredItems.concat(starredItem));
  addApi(starredItem).subscribe(noop, e => {
    logger.warn('Failed to add starred item', e);

    // Undo optimistic update
    store.applyStateMutation(starredItems => starredItems.filter(item => item !== starredItem));
  });
}

export function remove({ id, type }) {
  const removedItems = [];

  store.applyStateMutation(starredItems =>
    starredItems.filter(item => {
      if (item.id === id && item.type === type) {
        removedItems.push(item);
        return false;
      }
      return true;
    })
  );

  removeApi({ id, type }).subscribe(noop, e => {
    logger.warn('Failed to remove starred item', e);

    // Undo optimistic update
    store.applyStateMutation(starredItems => starredItems.concat(removedItems));
  });
}
