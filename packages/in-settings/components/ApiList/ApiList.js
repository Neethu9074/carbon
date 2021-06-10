/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { useObservable } from '@instana/hooks';

import { DefaultListRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { pendingResult } from 'in-services/fixedObjects';
import { error } from 'in-components/Message/types';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

export default function ApiList({ deleteItem, itemName, getItems, boundedPath, orderBy, renderer, ...props }) {
  const [message, setMessage] = useState();
  const [currentDeletingItemIds, setCurrentDeletingItemIds] = useState(new Map());
  const [{ query, page }, setState] = useUrlState({
    bind: [
      {
        path: boundedPath ?? '/',
        name: 'query',
        initialState: ''
      },
      {
        path: boundedPath ?? '/',
        name: 'page',
        initialState: 1,
        parser: intParser
      }
    ]
  });

  const itemsResult = useObservable(getItems, []) ?? pendingResult;

  const setErrorMessage = text => setMessage({ text, type: error });
  const newProps = {
    ...props,
    setMessage,
    setErrorMessage,
    currentDeletingItemIds,
    itemName,
    getItems,
    boundedPath,
    deleteItem: id =>
      deleteItemInternal(deleteItem, currentDeletingItemIds, setCurrentDeletingItemIds, setErrorMessage, itemName, id),
    orderBy: orderBy || 'name',
    setQuery: query => setState({ query, page: 1 }),
    setPage: page => setState({ page }),
    query,
    page,
    message,
    itemsResult
  };

  return renderer ? renderer(newProps) : <DefaultListRenderer {...newProps} />;
}

function deleteItemInternal(deleteItem, currentIds, setCurrentDeletingItemIds, setErrorMessage, itemName, id) {
  const deletion$ = deleteItem(id);

  currentIds = new Map(currentIds);
  currentIds.set(id, true);
  setCurrentDeletingItemIds(currentIds);

  deletion$.once(
    () => {
      currentIds.delete(id);
      setCurrentDeletingItemIds(currentIds);
    },
    error => {
      setErrorMessage(
        itemName
          ? t('in-settings:components.failedToRemoveItemName', { itemName: itemName })
          : t('in-settings:components.failedToRemoveItem') + ` (${id}): ${error.message}`
      );
      currentIds.delete(id);
      setCurrentDeletingItemIds(currentIds);
    }
  );
}
