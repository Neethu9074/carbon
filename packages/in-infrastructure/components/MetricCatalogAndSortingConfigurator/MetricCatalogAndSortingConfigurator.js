/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import MetricCatalogConfigurator from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';

import locals from './MetricCatalogAndSortingConfigurator.mless';

export default function MetricCatalogAndSortingConfigurator({
  sortOptions,
  order,
  setOrder,
  metrics,
  setMetrics,
  tracking,
  MetricConfiguratorHint,
  query,
  onQueryChange,
  metricCatalog,
  type,
  metricMetadatas
}) {
  return (
    <div className={locals.wrapper}>
      <MetricCatalogConfigurator
        values={metrics}
        onChange={setMetrics}
        tracking={tracking}
        MetricConfiguratorHint={MetricConfiguratorHint}
        query={query}
        onQueryChange={onQueryChange}
        metricCatalog={metricCatalog}
        type={type}
        metricMetadatas={metricMetadatas}
      />
      {sortOptions && <SortingConfigurator options={sortOptions} orderBy={order} onChange={setOrder} />}
    </div>
  );
}
