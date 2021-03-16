/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import MetricConfigurator from 'in-new-components/MetricConfigurator/MetricConfigurator';

import locals from './MetricAndSortingConfigurator.mless';

export default function MetricAndSortingConfigurator({
  sortOptions,
  order,
  setOrder,
  metrics,
  setMetrics,
  metricOptions,
  tracking,
  MetricConfiguratorHint
}) {
  const hasMetrics = metricOptions?.length > 0;
  if (!sortOptions && !hasMetrics) {
    return null;
  }

  return (
    <div className={locals.wrapper}>
      {hasMetrics && (
        <MetricConfigurator
          options={metricOptions}
          values={metrics}
          onChange={setMetrics}
          tracking={tracking}
          MetricConfiguratorHint={MetricConfiguratorHint}
        />
      )}
      {sortOptions && <SortingConfigurator options={sortOptions} orderBy={order} onChange={setOrder} />}
    </div>
  );
}
