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
  tracking
}) {
  return (
    <div className={locals.wrapper}>
      <MetricConfigurator options={metricOptions} values={metrics} onChange={setMetrics} tracking={tracking} />
      {sortOptions && <SortingConfigurator options={sortOptions} orderBy={order} onChange={setOrder} />}
    </div>
  );
}
