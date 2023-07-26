/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useState, useMemo, useCallback } from 'react';

import { useObservable } from '@instana/hooks';

import { Order, OrderDirectionType, TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
// @ts-expect-error
import getGroups from 'in-infrastructure/subscriptions/getGroups';
import { pendingResult } from 'in-services/fixedObjects';
import { mapData } from 'in-services/util/result';
import { getPluginName } from 'in-sdk/pluginName';

interface Props {
  backendQueryModel: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  order: Order;
  setOrder: (order: Order) => void;
}

export default function useInfrastructureEntities({ backendQueryModel, timeConfig, order, setOrder }: Props) {
  const typesResult =
    useObservable(() => getAvailableTypes({ timeConfig, backendQueryModel }), [timeConfig, backendQueryModel]) ??
    pendingResult;

  const [query, setQuery] = useState('');

  const tableResult = useMemo(
    () =>
      //@ts-expect-error
      mapData(typesResult, (data: any) => {
        //@ts-expect-error
        const rawItems = data.items.map(({ tags: { type }, count = 0 }) => ({
          type,
          label: getPluginName(type),
          count
        }));
        const filteredItems = rawItems.filter((item: any) => item.label.toLowerCase().includes(query.toLowerCase()));
        const items = sortItems(filteredItems, order.by, order.direction);
        return { items, page: 1 };
      }),
    [typesResult, order.by, order.direction, query]
  );

  const onChange = useCallback(
    ({ query, orderBy, orderDirection }) => {
      setQuery(query);
      setOrder({ by: orderBy, direction: orderDirection });
    },
    [setQuery, setOrder]
  );

  return {
    onChange,
    tableResult,
    query
  };
}

interface SortItem {
  label: string;
  count: number;
}

function sortItems(items: any, orderBy: string, orderDirection: OrderDirectionType) {
  if (orderBy === 'label') {
    return items.sort((a: SortItem, b: SortItem) => {
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
    return items.sort((a: SortItem, b: SortItem) => {
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
}: {
  timeConfig: TimeConfig;
  backendQueryModel: TagFilterExpressionElementUnion;
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
