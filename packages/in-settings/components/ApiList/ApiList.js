/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { compose, withProps, withPropsOnChange, withState } from 'recompose';
import React from 'react';

import { DefaultListRenderer } from 'in-settings/components/ApiList/renderer/renderer';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { error } from 'in-new-components/Message/types';
import withUrlState from 'in-hoc/withUrlState';
import connectTo from 'in-hoc/connectTo';

export default function createApiList(props) {
  const { deleteItem, itemName, getItems, boundedPath, orderBy } = props;

  return compose(
    connectTo({ itemsResult: getItems() }),
    withState('messageFromOutside', 'setMessage', undefined),
    withPropsOnChange(['messageFromOutside', 'itemsResult'], ({ messageFromOutside }) => ({
      message: messageFromOutside
    })),
    withUrlState({
      bind: [
        {
          path: boundedPath,
          name: 'query',
          initialState: ''
        },
        {
          path: boundedPath,
          name: 'page',
          initialState: 1,
          parser: intParser
        }
      ],
      reducerName: 'setState'
    }),
    withState('currentDeletingItemIds', 'setCurrentDeletingItemIds', new Map()),
    withProps(_props => {
      const setErrorMessage = text => _props.setMessage({ text, type: error });

      const deleteItemAction = deleteItemInternal.bind(
        null,
        deleteItem,
        _props.currentDeletingItemIds,
        _props.setCurrentDeletingItemIds,
        setErrorMessage,
        itemName
      );

      return {
        ...props,
        setErrorMessage,
        deleteItem: id => deleteItemAction(id),
        orderBy: orderBy || 'name',
        setQuery: query => _props.setState({ query, page: 1 }),
        setPage: page => _props.setState({ page })
      };
    })
  )(Render);
}

function Render(props) {
  return props.renderer ? props.renderer(props) : <DefaultListRenderer {...props} />;
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
      setErrorMessage(`Failed to remove ${itemName || 'item'} (${id}): ${error.message}`);
      currentIds.delete(id);
      setCurrentDeletingItemIds(currentIds);
    }
  );
}
