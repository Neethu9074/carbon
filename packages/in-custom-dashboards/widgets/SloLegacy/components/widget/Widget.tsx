/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { MetricResult, Progress, SliConfigurationWithLastUpdated, Error } from '@instana/types';
import { Card } from '@instana/components';

import WidgetLoadingIndicator from 'in-custom-dashboards/widgets/SloLegacy/components/widget/WidgetLoadingIndicator';
import WidgetLeftHeader from 'in-custom-dashboards/widgets/SloLegacy/components/widget/WidgetLeftHeader';
import { TimeWindowConfig } from 'in-custom-dashboards/widgets/SloLegacy/hooks/useWidgetTimeConfig';
import WidgetContent from 'in-custom-dashboards/widgets/SloLegacy/components/widget/WidgetContent';
import SliSummary from 'in-custom-dashboards/widgets/SloLegacy/components/SliSummary';
import { SliType } from 'in-custom-dashboards/widgets/SloLegacy/sli/sliTypes';
import { TimeWindowType } from 'in-custom-dashboards/widgets/SloLegacy/form';
import { widgetPreviewHeight } from 'in-custom-dashboards/widgets/SloLegacy';
import { findMetric } from 'in-custom-dashboards/widgets/SloLegacy/metric';
import { MonitoredEntity } from 'in-service-levels/utils/loadEntities';
import { MetricDataSeries } from 'in-components/Chart/types';
import { FetchStatus } from 'in-hooks/utils/types';

import locals from './Widget.mless';

interface WidgetProps {
  title: string;
  entityType: SliType;
  entity?: MonitoredEntity;
  sliConfiguration?: SliConfigurationWithLastUpdated;

  slo: number;
  sloMetrics?: MetricResult[];
  granularity: number;

  timeWindowType: TimeWindowType;
  timeWindowConfig: TimeWindowConfig;

  status: FetchStatus;
  progress: Progress;
  errors: Error[];

  isPreview?: boolean;
  isInModal?: boolean;
  disableZooming?: boolean;
  nonInteractive?: boolean;

  actions?: React.ReactNode;
  dragHandle?: React.ReactNode;
}

export default function Widget({
  title,
  entityType,
  entity,
  sliConfiguration,
  slo,
  sloMetrics,
  granularity,
  timeWindowType,
  timeWindowConfig,
  status,
  progress,
  errors,
  isPreview,
  disableZooming,
  nonInteractive,
  actions,
  isInModal,
  dragHandle
}: WidgetProps) {
  const { timeConfig, fromTimestamp, toTimestamp } = timeWindowConfig;

  const budget = getMetricValue(findMetric('budget', sloMetrics));
  const spent = getMetricValue(findMetric('spent', sloMetrics));
  const sli = getMetricValue(findMetric('sli', sloMetrics));
  const remaining = getMetricValue(findMetric('remaining', sloMetrics));

  return (
    <div className={locals.loadingBarContainer}>
      <WidgetLoadingIndicator progress={progress} />
      <Card
        className={classNames({
          [locals.modal]: isInModal
        })}
        bodyClassName={locals.noPadding}
        rightHeaderContent={
          <>
            {dragHandle}
            {actions}
          </>
        }
        headerClassName={classNames({
          [locals.title]: true,
          [locals.noPaddingTitle]: isInModal
        })}
        leftHeaderContent={
          <WidgetLeftHeader
            title={title}
            status={status}
            monitoredEntityType={entityType}
            monitoredEntity={entity}
            sliConfig={sliConfiguration}
            isPreview={isPreview}
          />
        }
      >
        <div
          className={classNames({
            [locals.chart]: true,
            [locals.noPadding]: isInModal
          })}
        >
          <SliSummary
            status={status}
            slo={slo}
            budget={budget}
            timeWindowType={timeWindowType ?? 'dynamic'}
            fromTimestamp={fromTimestamp}
            toTimestamp={toTimestamp}
            sliEntity={sliConfiguration?.sliEntity}
            metricSpent={spent}
            metricSli={sli}
            metricRemaining={remaining}
          />
          <WidgetContent
            sloMetrics={sloMetrics}
            loadingErrors={errors}
            loadingProgress={progress}
            timeConfig={timeConfig}
            granularity={granularity}
            budget={budget ?? 0}
            sliConfig={sliConfiguration}
            nonInteractive={isPreview || nonInteractive}
            disableZooming={disableZooming}
            customHeight={isPreview ? widgetPreviewHeight : undefined}
          />
        </div>
      </Card>
    </div>
  );
}

const getMetricValue = (metric: MetricDataSeries = []): number | undefined => {
  return metric[0]?.[1];
};
