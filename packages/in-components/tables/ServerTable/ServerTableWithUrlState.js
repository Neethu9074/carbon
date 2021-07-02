/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { getSingle, setSingle } from 'in-services/settings/settings';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { shallowEquals } from 'in-services/util/object';
import useUrlState from 'in-hooks/useUrlState';

export default function createServerTableWithUrlState({
  paginationResettingUrlParameters = emptyArray,
  columnDefinitions: staticColumnDefinitions,
  defaultOrderBy,
  defaultOrderDirection,
  defaultPageSize,
  defaultQuery,
  defaultDisabledColumns,
  settingsKey,
  pathSegment,
  matrixPrefix = '',
  isSearchable = true,
  Renderer = ServerTablePresenter
}) {
  const urlStateDefinition = {
    bind: [
      {
        path: pathSegment,
        name: `${matrixPrefix}orderBy`,
        as: 'orderBy',
        initialState: defaultOrderBy || staticColumnDefinitions[0].id
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}orderDirection`,
        as: 'orderDirection',
        initialState: defaultOrderDirection || 'ASC'
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
        initialState: defaultPageSize || 20,
        parser: intParser
      },
      {
        path: pathSegment,
        name: `${matrixPrefix}query`,
        as: 'query',
        initialState: defaultQuery || ''
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
        bind: paginationResettingUrlParameters,
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

  return function ServerTable(props) {
    const [urlState, setUrlState] = useUrlState(urlStateDefinition);

    const propsForObservable = {
      ...props,
      ...urlState
    };
    const observable =
      props.query?.length > 0
        ? timeout(800).flatMap(() => props.get(propsForObservable))
        : props.get(propsForObservable);
    const result = useObservable(observable, Object.values(propsForObservable)) ?? pendingResult;

    const columnDefinitions =
      useObservable(
        props.columnDefinitions && props.columnDefinitions({ ...propsForObservable, result }),
        Object.values(propsForObservable).concat([result])
      ) ?? (props.columnDefinitions ? [] : staticColumnDefinitions);

    const optionalColumns = useMemo(() => columnDefinitions.filter(columnDefinition => columnDefinition.optional), [
      columnDefinitions
    ]);

    const rendererProps = {
      ...propsForObservable,
      result,
      columnDefinitions,
      isSearchable,
      optionalColumns,
      onChange: setUrlState
    };
    return <Renderer {...rendererProps} />;
  };
}

function getInitialDisabledColumns(settingsKey, defaultDisabledColumns) {
  if (settingsKey) {
    const columnsFromSettings = getSingle(settingsKey);
    if (columnsFromSettings) {
      return columnsFromSettings.ids;
    }
  }

  return defaultDisabledColumns || [];
}
