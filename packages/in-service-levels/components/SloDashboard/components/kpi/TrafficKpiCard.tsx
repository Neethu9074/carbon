/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';

import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { FormatterFn } from 'in-stores/metric/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TrafficKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function TrafficKpiCard({ configuration, timeConfig }: TrafficKpiCardProps) {
  const { entity } = configuration;
  const { primaryMetricConfiguration, companionMetricConfiguration } = useMetricConfiguration(entity, timeConfig);
  const { primaryFormatter, companionFormatter } = getFormatters(entity);

  return (
    <BigNumberKpiCard
      title="Traffic"
      formatter={primaryFormatter}
      companionFormatter={companionFormatter}
      config={{
        metricConfiguration: primaryMetricConfiguration,
        companionMetricConfiguration: companionMetricConfiguration
      }}
    />
  );
}

interface MetricConfigurations {
  primaryMetricConfiguration: UnifiedMetricConfigurationUnion;
  companionMetricConfiguration?: UnifiedMetricConfigurationUnion;
}

function useMetricConfiguration(entity: SloEntityUnion, timeConfig: TimeConfig): MetricConfigurations {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
  if (isApplicationSloEntity(entity)) {
    const config = {
      source: 'APPLICATION',
      dataSource: 'CALLS',
      tagFilterExpression,
      timeShift: { offset: 0 },
      includeInternal: Boolean(entity.includeInternal),
      includeSynthetic: Boolean(entity.includeSynthetic),
      metric: 'calls',
      resultType: 'SINGLE_NUMBER',
      queryPrecision: 'FULL',
      timeConfig
    } as const;
    return {
      primaryMetricConfiguration: { ...config, aggregation: 'PER_SECOND' },
      companionMetricConfiguration: { ...config, aggregation: 'SUM' }
    };
  }

  if (isWebsiteSloEntity(entity)) {
    const config = {
      source: 'WEBSITE',
      metric: 'beaconCount',
      beaconType: entity.beaconType,
      tagFilterExpression,
      timeShift: { offset: 0 },
      timeConfig,
      resultType: 'SINGLE_NUMBER'
    } as const;
    return {
      primaryMetricConfiguration: { ...config, aggregation: 'SUM' }
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}

interface Formatters {
  primaryFormatter: FormatterFn;
  companionFormatter?: FormatterFn;
}

function getFormatters(entity: SloEntityUnion): Formatters {
  const eventFormatter = createSloEventFormatter(entity);
  if (isApplicationSloEntity(entity)) {
    return {
      primaryFormatter: number.perSecond.compact,
      companionFormatter: value =>
        t('in-service-levels:sloDashboard.components.trafficKpiCard.totalTraffic', {
          value: eventFormatter(value)
        })
    };
  }
  if (isWebsiteSloEntity(entity)) {
    return {
      primaryFormatter: eventFormatter
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
