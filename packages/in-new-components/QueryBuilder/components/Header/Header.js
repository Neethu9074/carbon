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
    withGrouping,
    withResultsInGroups,
    MetricConfiguratorHint
  } = props;
  return (
    <div className={locals.wrapper}>
      <CountHeader
        totalRepresentedItemCount={totalRepresentedItemCount}
        totalHits={totalHits}
        getItemName={getItemName}
        getHitName={getHitName}
        withSamplingTooltip={withSamplingTooltip}
        withGrouping={withGrouping}
        withResultsInGroups={withResultsInGroups}
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
          MetricConfiguratorHint={MetricConfiguratorHint}
        />
      </HorizontalFlexWrapper>
    </div>
  );
}
