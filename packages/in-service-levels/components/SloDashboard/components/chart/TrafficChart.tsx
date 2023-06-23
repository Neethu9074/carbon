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
  TimeConfig
} from '@instana/types';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
// eslint-disable-next-line no-restricted-imports -- We cant specifically allow parts of a otherwise restricted package
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import SloDashboardMarkerLanes from 'in-service-levels/components/SloDashboard/components/chart/SloDashboardMarkerLanes';
import { calculateSloReferenceChartGranularity } from 'in-service-levels/components/SloDashboard/components/chart/utils';
import useBasicTagFilterExpression from 'in-service-levels/navigation/hooks/useBasicFilterExpression';
import { applicationMetrics, websiteMetrics } from 'in-service-levels/metrics';
import { ServiceLevelErrors } from 'in-service-levels/constants';

interface TrafficChartProps {
  configuration: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export default function TrafficChart({ configuration, timeConfig }: TrafficChartProps) {
  const { entity } = configuration;
  const granularity = calculateSloReferenceChartGranularity(timeConfig);
  const metric = useMetricConfiguration(entity, granularity, timeConfig);

  return (
    <UnifiedMetricsChart
      title={t('in-service-levels:sloDashboard.components.trafficChart.title')}
      config={{
        y1: {
          metrics: [metric],
          formatter: 'number.compact'
        },
        granularity,
        type: 'TIME_SERIES'
      }}
      timeConfig={timeConfig}
      renderPostChartContent={props => <SloDashboardMarkerLanes entity={entity} {...props} />}
    />
  );
}

function useMetricConfiguration(entity: SloEntityUnion, granularity: number, timeConfig: TimeConfig): Metric {
  const tagFilterExpression = useBasicTagFilterExpression({ entity });
  if (isApplicationSloEntity(entity)) {
    return {
      label: applicationMetrics.calls.label,
      ...applicationMetrics.calls.timeSeries({ entity, tagFilterExpression, timeConfig, granularity })
    };
  }

  if (isWebsiteSloEntity(entity)) {
    return {
      label: websiteMetrics.beaconCount.label,
      ...websiteMetrics.beaconCount.timeSeries({ entity, tagFilterExpression, timeConfig, granularity })
    };
  }

  throw new Error(ServiceLevelErrors.UNHANDLED_SLO_ENTITY_TYPE);
}
