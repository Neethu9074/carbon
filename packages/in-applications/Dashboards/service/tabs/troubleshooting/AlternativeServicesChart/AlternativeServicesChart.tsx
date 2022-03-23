/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactElement } from 'react';

import { useObservable } from '@instana/hooks';

import AlternativeServicesChartPresenter from 'in-applications/Dashboards/service/tabs/troubleshooting/AlternativeServicesChart/AlternativeServicesChartPresenter';
import getServicesCorrelatedByTag from 'in-applications/subscriptions/getServicesCorrelatedByTag';
import { PaginatedResult, Result, ServiceItem, TagFilterEntity, TimeConfig } from 'in-types';
import { getChartGranularity } from 'in-stores/metric/metric';
import { FormatterFn } from 'in-stores/metric/formatters';
import { pendingResult } from 'in-services/fixedObjects';
import { Renderer } from 'in-components/Chart/types';

export interface MetricDefinition {
  label: string;
  metric: string;
  aggregation: string;
  formatter: FormatterFn;
  renderer: Renderer;
  fallbackMetricValue?: [number, number][];
}

export interface AlternativeServicesChartWrapperProps {
  timeConfig: TimeConfig;
  serviceId: string;
  correlationTag: string;
  correlationTagEntity: TagFilterEntity;
  correlationTagSecondLevelKey?: string;
  cardHeader?: ReactElement;
  cardTitle?: string;
  metricDefinition: MetricDefinition;
}

export default function AlternativeServicesChartWrapper(props: AlternativeServicesChartWrapperProps) {
  const {
    timeConfig,
    serviceId,
    correlationTag,
    correlationTagEntity,
    correlationTagSecondLevelKey,
    metricDefinition
  } = props;

  const result: Result<PaginatedResult<ServiceItem>> =
    useObservable(getServicesCorrelationByTagObservable, [
      timeConfig,
      serviceId,
      correlationTag,
      correlationTagEntity,
      correlationTagSecondLevelKey
    ]) ?? pendingResult;

  const hasApproximateData = result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE';

  return (
    <AlternativeServicesChartPresenter
      {...props}
      result={result}
      metricDefinition={metricDefinition}
      renderHistoricDataIndicator={hasApproximateData}
      translateLabel={(id: string) => {
        const serviceItem = result?.data?.items?.find((item: ServiceItem) => item.service.id === id);
        return serviceItem?.service?.label ?? id;
      }}
    />
  );
}

function getServicesCorrelationByTagObservable([
  timeConfig,
  serviceId,
  correlationTag,
  correlationTagEntity,
  correlationTagSecondLevelKey
]: [TimeConfig, string, string, TagFilterEntity, string?]) {
  return getServicesCorrelatedByTag({
    serviceId,
    correlationTag,
    correlationTagEntity,
    correlationTagSecondLevelKey,
    pagination: {
      page: 1,
      pageSize: 20
    },
    order: {
      by: 'calls',
      direction: 'DESC'
    },
    metrics: {
      calls: {
        metric: 'calls',
        aggregation: 'SUM',
        granularity: getChartGranularity(timeConfig)
      }
    },
    filter: {
      timeConfig,
      includeInternalCalls: false,
      includeSyntheticCalls: false,
      useLongTermDataOnly: false
    },
    queryPrecision: 'FULL'
  });
}
