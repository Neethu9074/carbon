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
  ServiceLevelIndicatorUnion,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import NoValueKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/NoValueKpiCard';
import { applicationMetrics, syntheticMetrics, websiteMetrics } from 'in-service-levels/metrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import { isTrafficBlueprintIndicator } from 'in-service-levels/types';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { FormatterFn } from 'in-stores/metric/formatters';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface TrafficKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TrafficKpiCard({ configuration }: TrafficKpiCardProps) {
  const { entity, indicator } = configuration;
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const { timeWindows } = useSloTimeWindowContext();

  const { primaryMetricConfiguration, companionMetricConfiguration } = useMetricConfiguration({
    entity,
    indicator,
    timeConfig
  });

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

interface MetricConfigurations {
  primaryMetricConfiguration: UnifiedMetricConfigurationUnion;
  companionMetricConfiguration?: UnifiedMetricConfigurationUnion;
}

interface UseMetricConfigurationProps {
  entity: SloEntityUnion;
  indicator: ServiceLevelIndicatorUnion;
  timeConfig: TimeConfig;
}

function useMetricConfiguration({ entity, indicator, timeConfig }: UseMetricConfigurationProps): MetricConfigurations {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
  if (isApplicationSloEntity(entity)) {
    const metricProps = { entity, tagFilterExpression, timeConfig };
    return {
      primaryMetricConfiguration: applicationMetrics.calls.singleNumber({ ...metricProps, aggregation: 'PER_SECOND' }),
      companionMetricConfiguration: applicationMetrics.calls.singleNumber(metricProps)
    };
  }

  if (isWebsiteSloEntity(entity)) {
    return {
      primaryMetricConfiguration: websiteMetrics.beaconCount.singleNumber({ entity, tagFilterExpression, timeConfig })
    };
  }

  if (isSyntheticSloEntity(entity)) {
    const shouldFetchErroneousMetrics = isTrafficBlueprintIndicator(indicator) && indicator.trafficType === 'erroneous';
    const metric = shouldFetchErroneousMetrics ? 'erroneousTests' : 'allTests';

    return {
      primaryMetricConfiguration: syntheticMetrics[metric].singleNumber({ entity, tagFilterExpression, timeConfig })
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

  if (isSyntheticSloEntity(entity)) {
    return {
      primaryFormatter: eventFormatter
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
