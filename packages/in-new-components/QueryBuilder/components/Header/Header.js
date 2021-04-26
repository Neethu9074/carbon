/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MetricAndSortingConfigurator from 'in-new-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
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
    getHitName,
    getItemName,
    setOrder,
    metrics,
    order,
    tracking,
    withSamplingTooltip,
    withAdjustedWindowSizeTooltip,
    withGrouping,
    withResultsInGroups,
    withCountHeader = true,
    MetricConfiguratorHint
  } = props;
  return (
    <div className={locals.wrapper}>
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
          MetricConfiguratorHint={MetricConfiguratorHint}
        />
      </HorizontalFlexWrapper>

      {withCountHeader && (
        <CountHeader
          totalRepresentedItemCount={totalRepresentedItemCount}
          totalHits={totalHits}
          getItemName={getItemName}
          getHitName={getHitName}
          withSamplingTooltip={withSamplingTooltip}
          withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
          withGrouping={withGrouping}
          withResultsInGroups={withResultsInGroups}
        />
      )}
    </div>
  );
}
