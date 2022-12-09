/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { MetricDescription } from '@instana/types/typeDefinitions';

// @ts-expect-error needs TS migration
import CountHeader from 'in-components/QueryBuilder/components/Header/CountHeader';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import { UngroupedViewProps } from 'in-components/AnalyzeView/UngroupedView/types';
import { OrderBy } from 'in-logging/analyze/AnalyzeView/components/Logs/types';

import locals from './Header.mless';

type Metric = {
  metric: string;
  aggregation?: string;
};

export interface HeaderProps extends UngroupedViewProps {
  withGrouping?: boolean;
  withAdjustedWindowSizeTooltip: boolean;
  withResultsInGroups?: boolean;
  renderHistoricDataIndicator: boolean;
  hasErrors: boolean;
  fastQueryModeEnabled?: boolean;
  order: OrderBy;
  totalHits?: number;
  totalRetainedItemCount?: number;
  totalRepresentedItemCount?: number;
  getHitName?: () => string;
  setOrder: (order: OrderBy) => void;
  availableMetrics: MetricDescription[];
  metrics: Metric[];
  setMetrics: (metrics: Metric[]) => void;
  tracking: Record<string, (metric: Metric) => void>;
  withCountHeader?: boolean;
  MetricConfiguratorHint: (props: { metricId: string }) => JSX.Element | null;
}

export default function Header(props: HeaderProps) {
  const {
    totalRepresentedItemCount,
    CustomHeaderActions,
    totalHits,
    totalRetainedItemCount,
    getHitName,
    getItemName,
    withAdjustedWindowSizeTooltip,
    withGrouping,
    withResultsInGroups,
    withCountHeader = true,
    hasErrors,
    isLoading,
    dataSource,
    renderHistoricDataIndicator = false,
    fastQueryModeEnabled
  } = props;

  return (
    <div className={locals.wrapper}>
      <HorizontalFlexWrapper>{CustomHeaderActions && <CustomHeaderActions {...props} />}</HorizontalFlexWrapper>

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
