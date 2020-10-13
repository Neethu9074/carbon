import React from 'react';

import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import MetricConfigurator from 'in-new-components/MetricConfigurator/MetricConfigurator';
import CountHeader from 'in-infrastructure/Explore/components/CountHeader';

import locals from './Header.mless';

export default function Header({
  totalRepresentedItemCount,
  availableMetrics,
  sortOptions,
  setMetrics,
  totalHits,
  itemName,
  showSort,
  setOrder,
  hitName,
  metrics,
  order
}) {
  const hasMetrics = availableMetrics?.length > 0;

  return (
    <div className={locals.wrapper}>
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        itemName={itemName}
        hitName={hitName}
      />
      {hasMetrics && (
        <div className={locals.metricWrapper}>
          {showSort && <SortingConfigurator options={sortOptions} orderBy={order} onChange={setOrder} />}
          <MetricConfigurator options={availableMetrics} values={metrics} onChange={setMetrics} />
        </div>
      )}
    </div>
  );
}
