/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import MetricAndSortingConfigurator from 'in-components/MetricAndSortingConfigurator/MetricAndSortingConfigurator';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import CountHeader from 'in-components/QueryBuilder/components/Header/CountHeader';

import locals from './Header.mless';

export default function Header(props) {
  const {
    totalRepresentedItemCount,
    CustomHeaderActions,
    availableMetrics,
    sortOptions,
    setMetrics,
    totalHits,
    totalRetainedItemCount,
    getHitName,
    getItemName,
    setOrder,
    metrics,
    order,
    tracking,
    withAdjustedWindowSizeTooltip,
    withGrouping,
    withResultsInGroups,
    withCountHeader = true,
    MetricConfiguratorHint,
    hasErrors,
    isLoading,
    dataSource,
    renderHistoricDataIndicator = false,
    fastQueryModeEnabled
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
          totalRetainedItemCount={totalRetainedItemCount}
          totalHits={totalHits}
          dataSource={dataSource}
          isLoading={isLoading}
          hasErrors={hasErrors}
          getItemName={getItemName}
          getHitName={getHitName}
          withAdjustedWindowSizeTooltip={withAdjustedWindowSizeTooltip}
          withGrouping={withGrouping}
          withResultsInGroups={withResultsInGroups}
          renderHistoricDataIndicator={renderHistoricDataIndicator}
          fastQueryModeEnabled={fastQueryModeEnabled}
        />
      )}
    </div>
  );
}
