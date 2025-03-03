/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion
} from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import NoValueKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/NoValueKpiCard';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { FormatterFn } from 'in-stores/metric/formatters';
import { sloMetrics } from 'in-service-levels/metrics';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TrafficKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TrafficKpiCard({ configuration }: TrafficKpiCardProps) {
  const { entity } = configuration;
  const configId = configuration.id!;
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const { timeWindows } = useSloTimeWindowContext();

  const [primaryMetricConfiguration, companionMetricConfiguration] = [
    isApplicationSloEntity(entity)
      ? sloMetrics.trafficPerSecond.singleNumber({ configId, timeConfig })
      : sloMetrics.totalTraffic.singleNumber({ configId, timeConfig }),
    isApplicationSloEntity(entity) ? sloMetrics.totalTraffic.singleNumber({ configId, timeConfig }) : undefined
  ];

  const hasMatchingTimeWindows = timeWindows.length > 0;

  if (!hasMatchingTimeWindows)
    return <NoValueKpiCard title={t('in-service-levels:sloDashboard.components.trafficKpiCard.title')} />;

  const { primaryFormatter, companionFormatter } = getFormatters(entity);

  return (
    <BigNumberKpiCard
      title={t('in-service-levels:sloDashboard.components.trafficKpiCard.title')}
      formatter={primaryFormatter}
      companionFormatter={companionFormatter}
      config={{
        metricConfiguration: primaryMetricConfiguration,
        companionMetricConfiguration: companionMetricConfiguration
      }}
    />
  );
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

  if (isSyntheticSloEntity(entity)) {
    return {
      primaryFormatter: eventFormatter
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
