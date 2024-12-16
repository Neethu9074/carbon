/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo, useCallback } from 'react';

import { useObservable } from '@instana/hooks';

import {
  CursorPaginatedResult,
  InfrastructureGroup,
  Order,
  OrderDirectionType,
  Result,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import getGroups from 'in-infrastructure/subscriptions/getGroups';
import { pendingResult } from 'in-services/fixedObjects';
import { hiddenPlugins } from 'in-forge/constants';
import { mapData } from 'in-services/util/result';
import { getPluginName } from 'in-sdk/pluginName';

interface Props {
  backendQueryModel: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  order: Order;
  setOrder: (order: Order) => void;
  query: string;
  setQuery: (query: string) => void;
}

export default function useInfrastructureEntities({
  backendQueryModel,
  timeConfig,
  order,
  setOrder,
  query,
  setQuery
}: Props) {
  const typesResult: Result<CursorPaginatedResult<InfrastructureGroup>> =
    useObservable(() => getAvailableTypes({ timeConfig, backendQueryModel }), [timeConfig, backendQueryModel]) ??
    pendingResult;

  const tableResult = useMemo(
    () =>
      mapData(typesResult, data => {
        const filteredItems = data.items
          .map(({ tags, count = 0 }) => ({
            type: tags?.type,
            label: getPluginName(tags?.type),
            count
          }))
          .filter(
            item =>
              !hiddenPlugins.includes(item.type) && item.label && item.label.toLowerCase().includes(query.toLowerCase())
          );
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
    tableResult
  };
}

interface SortItem {
  label: string;
  count: number;
}

function sortItems(items: any, orderBy: string, orderDirection: OrderDirectionType) {
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
  } else {
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
