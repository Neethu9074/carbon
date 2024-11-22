/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';

import {
  isApplicationSloEntity,
  isSyntheticSloEntity,
  isWebsiteSloEntity,
  ServiceLevelObjectiveConfiguration,
  SloEntityUnion,
  TimeConfig,
  UnifiedMetricConfigurationUnion
} from '@instana/types';

import useContextAwareSloTimeWindowConfig from 'in-service-levels/hooks/useContextAwareSloTimeWindowConfig';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import NoValueKpiCard from 'in-service-levels/components/SloDashboard/components/kpi/NoValueKpiCard';
import useSyntheticsTrafficMetrics from 'in-service-levels/hooks/useSyntheticsTrafficMetrics';
import useSloTimeWindowContext from 'in-service-levels/hooks/useSloTimeWindowContext';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { createSloEventFormatter } from 'in-service-levels/utils/format';
import BigNumberKpiCard from 'in-components/KpiCard/BigNumberKpiCard';
import ThresholdKpiCard from 'in-components/KpiCard/TresholdKpiCard';
import { ServiceLevelErrors } from 'in-service-levels/constants';
import { FormatterFn } from 'in-stores/metric/formatters';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface TrafficKpiCardProps {
  configuration: ServiceLevelObjectiveConfiguration;
}

export default function TrafficKpiCard({ configuration }: TrafficKpiCardProps) {
  if (isSyntheticSloEntity(configuration.entity)) return <SyntheticsTrafficKpiCard configuration={configuration} />;

  return <AppWebsiteTrafficKpiCard configuration={configuration} />;
}

function SyntheticsTrafficKpiCard({ configuration }: TrafficKpiCardProps) {
  const { entity, indicator } = configuration;

  if (!isSyntheticSloEntity(entity)) throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);

  const { timeWindows } = useSloTimeWindowContext();
  const timeConfig = useContextAwareSloTimeWindowConfig();
  const metricsTimeWindow = useMemo(() => {
    const now = Date.now();
    return [
      {
        ...timeConfig,
        to: timeConfig.to ?? now,
        focusedMoment: timeConfig.to ?? now,
        autoRefresh: false
      }
    ];
  }, [timeConfig]);
  const results = useSyntheticsTrafficMetrics(entity, indicator, metricsTimeWindow, undefined, 'SINGLE_NUMBER');
  const hasMatchingTimeWindows = timeWindows.length > 0;

  if (!hasMatchingTimeWindows)
    return <NoValueKpiCard title={t('in-service-levels:sloDashboard.components.trafficKpiCard.title')} />;

  const { primaryFormatter } = getFormatters(entity);
  const trafficSum = results.data?.flat(1).reduce((prev, [, value]) => prev + value, 0);

  return (
    <ThresholdKpiCard
      title={t('in-service-levels:sloDashboard.components.trafficKpiCard.title')}
      value={trafficSum ?? valueMissingPlaceholder}
      renderValue={primaryFormatter}
      resultPrecision="PRECISION_FULL"
      bigNumbers
    />
  );
}

function AppWebsiteTrafficKpiCard({ configuration }: TrafficKpiCardProps) {
  const { entity } = configuration;
  const timeConfig = useTimeConfig();
  const { primaryMetricConfiguration, companionMetricConfiguration } = useMetricConfiguration(entity, timeConfig);
  const { timeWindows } = useSloTimeWindowContext();
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

function useMetricConfiguration(entity: SloEntityUnion, timeConfig: TimeConfig): MetricConfigurations {
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
