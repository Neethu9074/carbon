/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { ListItem, CarbonDataTableWithUrlStateProps } from 'in-synthetics/components/constants';
import CarbonDataTablePresenter from 'in-synthetics/components/CarbonDataTablePresenter';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';

/**
 * CarbonDataTableWithUrlState component
 * Manages URL state for a Carbon data table and fetches data based on that state
 */
export default function CarbonDataTableWithUrlState<ITEM_TYPE extends ListItem, ADDITIONAL_PROPS extends Object>(
  props: CarbonDataTableWithUrlStateProps<ITEM_TYPE, ADDITIONAL_PROPS>
) {
  const {
    paginationResettingUrlParameters = emptyArray,
    columnDefinitions,
    defaultOrderBy,
    defaultOrderDirection,
    defaultPageSize,
    defaultPageSizes,
    defaultQuery,
    defaultDisabledColumns,
    pathSegment,
    isSearchable = true,
    matrixPrefix = '',
    get
  } = props;

  // Initialize URL state with defaults
  const [urlState, setUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: defaultOrderBy ?? columnDefinitions?.[0]?.id ?? '',
    defaultOrderDirection,
    defaultPageSize,
    defaultPageSizes,
    defaultQuery,
    defaultDisabledColumns,
    paginationResettingUrlParameters
  });

  // Prepare props for the observable
  const propsForObservable = useMemo(
    () => ({
      ...props,
      ...urlState
    }),
    // Only re-create when props or urlState change
    [props, urlState]
  );

  // Create observable for data fetching
  const observable = useMemo(() => get(propsForObservable), [get, propsForObservable]);

  // Subscribe to the observable and get results
  const result = useObservable(observable, [propsForObservable]) ?? pendingResult;

  // Extract optional columns
  const optionalColumns = useMemo(
    () => columnDefinitions.filter((columnDefinition: ColumnDefinition<ITEM_TYPE>) => columnDefinition.optional),
    [columnDefinitions]
  );

  // Prepare props for the presenter component
  const rendererProps = {
    ...propsForObservable,
    isSearchable,
    optionalColumns,
    result,
    onChange: setUrlState
  };

  return <CarbonDataTablePresenter {...rendererProps} />;
}
