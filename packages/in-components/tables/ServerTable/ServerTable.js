/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useState } from 'react';

import { timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { pendingResult } from 'in-services/fixedObjects';

const initialQueries = {
  retention: 'logging.updateLogsRetention'
};

export default function ServerTable(props) {
  const {
    columnDefinitions,
    defaultOrderBy,
    get,
    defaultOrderDirection,
    defaultPageSize,
    paginationResettingProps = [],
    defaultPageSizes,
    defaultQuery
  } = props;

  const location = useLocation();
  const initialQueryKey = location.pathname?.split('/actionlog/')[1];
  const initialQuery = initialQueries[initialQueryKey] ?? defaultQuery;

  const [{ page, orderBy, orderDirection, query, pageSize, pageSizes }, onChange] = useState(
    getInitialState(
      columnDefinitions,
      defaultOrderBy,
      defaultOrderDirection,
      defaultPageSize,
      initialQuery,
      defaultPageSizes
    )
  );

  useEffect(() => {
    onChange({ page: 1, orderBy, orderDirection, query, pageSize, pageSizes });
    // resetting to page 1 only on change of specific props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, paginationResettingProps);

  useEffect(() => {
    onChange(
      getInitialState(
        columnDefinitions,
        defaultOrderBy,
        defaultOrderDirection,
        defaultPageSize,
        initialQuery,
        defaultPageSizes
      )
    );
  }, [columnDefinitions, defaultOrderBy, get, defaultOrderDirection, defaultPageSize, initialQuery, defaultPageSizes]);

  const result = useObservable(
    query && query !== ''
      ? timeout(800)
          .flatMap(() => get({ ...props, query, page, pageSize, orderBy, orderDirection, pageSizes }))
          .startWith(pendingResult)
      : get({ ...props, query, page, pageSize, orderBy, orderDirection, pageSizes }),
    [query, page, orderBy, orderDirection, pageSize, pageSizes] // does not include all props - to avoid unneeded reload/retrigger
  );

  return (
    <ServerTablePresenter
      page={page}
      query={query}
      orderDirection={orderDirection}
      pageSize={pageSize}
      pageSizes={pageSizes}
      orderBy={orderBy}
      onChange={onChange}
      result={result}
      {...props}
    />
  );
}

function getInitialState(
  columnDefinitions,
  defaultOrderBy,
  defaultOrderDirection,
  defaultPageSize,
  defaultQuery,
  defaultPageSizes
) {
  return {
    orderBy: defaultOrderBy || columnDefinitions[0].id,
    orderDirection: defaultOrderDirection || 'ASC',
    page: 1,
    pageSize: defaultPageSize || 20,
    query: defaultQuery || '',
    pageSizes: defaultPageSizes
  };
}
