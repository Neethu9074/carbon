/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { useMemo } from 'react';

import { OrderDirection } from '@instana/types';

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import useUrlState, { Options, UrlStateReturn } from 'in-hooks/useUrlState';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { ParameterDefinition } from 'in-stores/navigation/types';
import { getSingle, setSingle } from 'in-services/settings';
import { shallowEquals } from 'in-services/util/object';

export interface ServerTableUrlState {
  orderBy: string;
  orderDirection: OrderDirection;
  page: number;
  pageSize: number;
  pageSizes?: number[];
  query: string;
  disabledColumns: string[];
  enabledColumns: string[];
}

interface UrlStateParams {
  pathSegment: string;
  matrixPrefix: string;
  settingsKey?: string;

  defaultOrderBy: string;
  defaultOrderDirection?: OrderDirection;
  defaultPageSize?: number;
  defaultPageSizes?: number[];
  defaultQuery?: string;
  defaultDisabledColumns?: readonly string[];

  paginationResettingUrlParameters?: readonly ParameterDefinition<any>[];
}

export default function useServerTableUrlState({
  pathSegment,
  matrixPrefix,
  settingsKey,
  defaultOrderBy,
  defaultOrderDirection,
  defaultPageSize,
  defaultPageSizes,
  defaultQuery,
  defaultDisabledColumns,
  paginationResettingUrlParameters
}: UrlStateParams): UrlStateReturn<ServerTableUrlState> {
  const urlStateDefinition = useMemo(
    () =>
      createUrlStateDefinition({
        pathSegment,
        matrixPrefix,
        settingsKey,
        defaultOrderBy,
        defaultOrderDirection,
        defaultPageSize,
        defaultPageSizes,
        defaultQuery,
        defaultDisabledColumns,
        paginationResettingUrlParameters
      }),
    [
      pathSegment,
      matrixPrefix,
      settingsKey,
      defaultOrderBy,
      defaultOrderDirection,
      defaultPageSize,
      defaultPageSizes,
      defaultQuery,
      defaultDisabledColumns,
      paginationResettingUrlParameters
    ]
  );

  return useUrlState(urlStateDefinition);
}

function createUrlStateDefinition({
  pathSegment,
  matrixPrefix,
  settingsKey,
  defaultOrderBy,
  defaultOrderDirection = 'ASC',
  defaultPageSize = 20,
  defaultPageSizes = [20, 40, 60, 80, 100],
  defaultQuery = '',
  defaultDisabledColumns,
  paginationResettingUrlParameters
}: UrlStateParams): Options<ServerTableUrlState> {
  // in case defaultPageSize is provided but defaultPageSizes is not
  if (!defaultPageSizes.includes(defaultPageSize)) {
    const indexToInsertAt = defaultPageSizes.findIndex(size => size > defaultPageSize);
    defaultPageSizes.splice(indexToInsertAt, 0, defaultPageSize);
  }

  return {
    bind: [
      {
        path: pathSegment,
        name: `${matrixPrefix}orderBy`,
        as: 'orderBy',
        initialState: defaultOrderBy
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}orderDirection`,
        as: 'orderDirection',
        initialState: defaultOrderDirection
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}page`,
        as: 'page',
        initialState: 1,
        parser: intParser
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}pageSize`,
        as: 'pageSize',
        initialState: defaultPageSize,
        parser: intParser
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}pageSizes`,
        as: 'pageSizes',
        initialState: defaultPageSizes,
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}query`,
        as: 'query',
        initialState: defaultQuery
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}disabledColumns`,
        as: 'disabledColumns',
        getInitialState: () => getInitialDisabledColumns(settingsKey, defaultDisabledColumns),
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      },
      // for columns that are defaultDisabled
      {
        path: pathSegment,
        name: `${matrixPrefix}enabledColumns`,
        as: 'enabledColumns',
        initialState: [],
        parser: buildJsonParser([]),
        serializer: buildJsonSerializer()
      }
    ],

    resets: [
      {
        bind: [...(paginationResettingUrlParameters ?? [])],
        reset: { page: 1 }
      }
    ],

    onUpdate: (prevState, newState) => {
      if (settingsKey) {
        if (!shallowEquals(prevState.disabledColumns, newState.disabledColumns)) {
          setSingle(settingsKey, { ids: newState.disabledColumns });
        }
      }
    }
  };
}

function getInitialDisabledColumns(settingsKey?: string, defaultDisabledColumns?: readonly string[]): string[] {
  if (settingsKey) {
    const columnsFromSettings = getSingle<{ ids: string[] }>(settingsKey);
    if (columnsFromSettings) {
      return columnsFromSettings.ids;
    }
  }

  return [...(defaultDisabledColumns || [])];
}
