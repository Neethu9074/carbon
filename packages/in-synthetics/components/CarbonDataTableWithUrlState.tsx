/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React, { useMemo } from 'react';

import { useObservable } from '@instana/hooks';

import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { ListItem, CarbonDataTableWithUrlStateProps } from 'in-synthetics/components/constants';
import SyntheticDataTablePresenter from 'in-synthetics/components/CarbonDataTablePresenter';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';
import { TableProps } from 'in-components/tables/ServerTable/types';

export default function CarbonDataTableWithUrlState<
  ITEM_TYPE extends ListItem,
  PROPS_TYPE extends TableProps<ITEM_TYPE>
>(props: CarbonDataTableWithUrlStateProps<ITEM_TYPE, PROPS_TYPE> & PROPS_TYPE) {
  const {
    paginationResettingUrlParameters = emptyArray,
    columnDefinitions: staticColumnDefinitions,
    defaultOrderBy,
    defaultOrderDirection,
    defaultPageSize,
    defaultPageSizes,
    defaultQuery,
    pathSegment,
    matrixPrefix = ''
  } = props;

  const [urlState, setUrlState] = useServerTableUrlState({
    pathSegment,
    matrixPrefix,
    defaultOrderBy: defaultOrderBy ?? staticColumnDefinitions[0].id,
    defaultOrderDirection,
    defaultPageSize,
    defaultPageSizes,
    defaultQuery,
    paginationResettingUrlParameters
  });

  const propsForObservable = useMemo(
    () => ({
      ...props,
      ...urlState
    }),
    // We use the values from the props object to only rerender if specific values changing
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.values(props), urlState]
  );

  const observable = props.get(propsForObservable);

  const result = useObservable(observable, [propsForObservable]) ?? pendingResult;

  const rendererProps = {
    ...propsForObservable,
    result: result,
    onChange: setUrlState
  };
  return <SyntheticDataTablePresenter {...rendererProps} />;
}
