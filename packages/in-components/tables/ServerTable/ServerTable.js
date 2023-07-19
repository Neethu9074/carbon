/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { pendingResult } from 'in-services/fixedObjects';

export default function ServerTable(props) {
  const {
    columnDefinitions,
    defaultOrderBy,
    get,
    defaultOrderDirection,
    defaultPageSize,
    paginationResettingProps = [],
    defaultQuery
  } = props;

  const [{ page, orderBy, orderDirection, query, pageSize }, onChange] = useState(
    getInitialState(columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery)
  );

  useEffect(() => {
    onChange({ page: 1, orderBy, orderDirection, query, pageSize });
    // resetting to page 1 only on change of specific props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, paginationResettingProps);

  useEffect(() => {
    onChange(getInitialState(columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery));
  }, [columnDefinitions, defaultOrderBy, get, defaultOrderDirection, defaultPageSize, defaultQuery]);

  const result = useObservable(
    query && query !== ''
      ? timeout(800)
          .flatMap(() => get({ ...props, query, page, pageSize, orderBy, orderDirection }))
          .startWith(pendingResult)
      : get({ ...props, query, page, pageSize, orderBy, orderDirection }),
    [query, page, orderBy, orderDirection, pageSize] // does not include all props - to avoid unneeded reload/retrigger
  );

  return (
    <ServerTablePresenter
      page={page}
      query={query}
      orderDirection={orderDirection}
      pageSize={pageSize}
      orderBy={orderBy}
      onChange={onChange}
      result={result}
      {...props}
    />
  );
}

function getInitialState(columnDefinitions, defaultOrderBy, defaultOrderDirection, defaultPageSize, defaultQuery) {
  return {
    orderBy: defaultOrderBy || columnDefinitions[0].id,
    orderDirection: defaultOrderDirection || 'ASC',
    page: 1,
    pageSize: defaultPageSize || 20,
    query: defaultQuery || ''
  };
}
