import React from 'react';

import MetricConfigurator from 'in-new-components/MetricConfigurator/MetricConfigurator';
import CountHeader from 'in-infrastructure/Explore/components/CountHeader';

import locals from './Header.mless';

export default function Header({
  totalRepresentedItemCount,
  availableMetrics,
  setMetrics,
  totalHits,
  itemName,
  hitName,
  metrics
}) {
  return (
    <div className={locals.wrapper}>
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        itemName={itemName}
        hitName={hitName}
      />
      {availableMetrics?.length > 0 && (
        <MetricSelector availableMetrics={availableMetrics} setMetrics={setMetrics} metrics={metrics} />
      )}
    </div>
  );
}

function MetricSelector({ metrics, setMetrics, availableMetrics }) {
  return <MetricConfigurator options={availableMetrics} values={metrics} onChange={setMetrics} />;
}
