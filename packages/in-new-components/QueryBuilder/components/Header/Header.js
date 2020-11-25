import React from 'react';

import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import CountHeader from 'in-new-components/QueryBuilder/components/Header/CountHeader';

import locals from './Header.mless';

export default function Header({
  totalRepresentedItemCount,
  availableMetrics,
  sortOptions,
  setMetrics,
  totalHits,
  itemName,
  setOrder,
  hitName,
  metrics,
  order,
  tracking
}) {
  return (
    <div className={locals.wrapper}>
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        itemName={itemName}
        hitName={hitName}
      />
      <MetricAndSortingConfigurator
        sortOptions={sortOptions}
        order={order}
        setOrder={setOrder}
        metricOptions={availableMetrics}
        metrics={metrics}
        setMetrics={setMetrics}
        tracking={tracking}
      />
    </div>
  );
}
