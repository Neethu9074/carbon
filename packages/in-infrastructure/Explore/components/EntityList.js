/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useInfrastructureEntities from 'in-infrastructure/Explore/hooks/useInfrastructureEntities';
import { ErroneousResult } from 'in-components/QueryBuilder/components/Header/CountHeader';
import EntityListPresenter from 'in-infrastructure/Explore/components/EntityListPresenter';

export default function EntityList({ timeConfig, order, setOrder, query, setQuery }) {
  const { onChange, tableResult } = useInfrastructureEntities({
    timeConfig,
    order,
    setOrder,
    query,
    setQuery
  });

  return (
    <>
      {tableResult.errors?.length > 0 && <ErroneousResult />}
      <EntityListPresenter order={order} result={tableResult} onChange={onChange} query={query} />
    </>
  );
}
