/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useCallback, useMemo, useState } from 'react';

import { useObservable } from '@instana/hooks';

import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { ErroneousResult } from 'in-components/QueryBuilder/components/Header/CountHeader';
import { pendingResult } from 'in-services/fixedObjects';
import EntityListPresenter from './EntityListPresenter';
import getGroups from '../../subscriptions/getGroups';
import { mapData } from 'in-services/util/result';
import { getPluginName } from 'in-sdk/pluginName';

export default function EntityList({ backendQueryModel, timeConfig, order, setOrder }) {
  const typesResult = useObservable(() => getAvailableTypes({timeConfig, backendQueryModel}), [timeConfig, backendQueryModel]) ?? pendingResult;
  const [query, setQuery] = useState('');
  const tableResult = useMemo(() => mapData(typesResult, data => {
    const rawItems = data.items.map(({tags: {type}, count = 0}) => ({type, label: getPluginName(type), count}));
    const filteredItems = rawItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()));
    const items = sortItems(filteredItems, order.by, order.direction);
    return {items, page: 1};
  }), [typesResult, order.by, order.direction, query]);

  const onChange = useCallback(({query, orderBy, orderDirection}) => {
    setQuery(query);
    setOrder({by: orderBy, direction: orderDirection});
  }, [setQuery, setOrder]);

  return (
    <>
      {tableResult.errors?.length > 0 && <ErroneousResult />}
      <EntityListPresenter order={order} result={tableResult} onChange={onChange} query={query} />
    </>
  );
}

function sortItems(items, orderBy, orderDirection) {
  if (orderBy === 'label') {
    return items.sort((a, b) => {
      if (a.label < b.label) {
        return orderDirection === 'DESC' ? 1 : -1;
      }
      if (a.label > b.label) {
        return orderDirection === 'DESC' ? -1 : 1;
      }
      return 0;
    });
  }
  if (orderBy === 'count') {
    return items.sort((a, b) => {
      if (a.count < b.count) {
        return orderDirection === 'DESC' ? 1 : -1;
      }
      if (a.count > b.count) {
        return orderDirection === 'DESC' ? -1 : 1;
      }
      return 0;
    });
  }
}

function getAvailableTypes({
  timeConfig,
  backendQueryModel = EMPTY_EXPRESSION
}) {
  return getGroups({
    pagination: {
      retrievalSize: 500,
      fullData: true
    },
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    firstPageOnly: true,
    groupBy: ['type']
  });
}
