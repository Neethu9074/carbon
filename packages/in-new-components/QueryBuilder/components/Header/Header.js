import React from 'react';

import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import HorizontalFlexWrapper from '../../../layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CountHeader from 'in-new-components/QueryBuilder/components/Header/CountHeader';

import locals from './Header.mless';

export default function Header(props) {
  const {
    totalRepresentedItemCount,
    CustomHeaderActions,
    availableMetrics,
    sortOptions,
    setMetrics,
    totalHits,
    itemName,
    setOrder,
    topText,
    hitName,
    metrics,
    order,
    tracking
  } = props;

  return (
    <div className={locals.wrapper}>
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        itemName={itemName}
        topText={topText}
        hitName={hitName}
      />

      <HorizontalFlexWrapper>
        {CustomHeaderActions && <CustomHeaderActions {...props} />}
        <MetricAndSortingConfigurator
          sortOptions={sortOptions}
          order={order}
          setOrder={setOrder}
          metricOptions={availableMetrics}
          metrics={metrics}
          setMetrics={setMetrics}
          tracking={tracking}
        />
      </HorizontalFlexWrapper>
    </div>
  );
}
