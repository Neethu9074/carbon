/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  AggregationType,
  ApplicationSloEntity,
  ServiceLevelObjectiveConfiguration,
  TagFilterExpressionElementUnion,
  TimeConfig,
  WebsiteSloEntity
} from '@instana/types';

import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { deepFreeze } from 'in-services/util/object';
import { t } from 'in-i18n';

interface SloMetricConfigGeneratorProps {
  configId: string;
  timeConfig: TimeConfig;
  granularity?: number;
}

interface ApplicationMetricConfigGeneratorProps {
  entity: Pick<ApplicationSloEntity, 'includeInternal' | 'includeSynthetic'>;
  tagFilterExpression: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  aggregation?: AggregationType;
}

interface WebsiteMetricConfigGeneratorProps {
  entity: Pick<WebsiteSloEntity, 'beaconType'>;
  tagFilterExpression: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  aggregation?: AggregationType;
}

interface SloPreviewConfigGeneratorProps {
  config: ServiceLevelObjectiveConfiguration;
  timeConfig: TimeConfig;
}

export const sloMetrics = deepFreeze({
  status: {
    label: t('in-service-levels:general.metrics.status'),
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'STATUS',
        timeConfig
      } as const)
  },
  remainingBudget: {
    label: t('in-service-levels:general.metrics.remainingBudget'),
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'ERROR_BUDGET_REMAINING',
        timeConfig
      } as const),
    timeSeries: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'ERROR_BUDGET_REMAINING_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
      } as const),
    timeSeriesCompact: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'ERROR_BUDGET_REMAINING_SPARK_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
      } as const)
  },
  totalBudget: {
    label: t('in-service-levels:general.metrics.totalBudget'),
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'TOTAL_ERROR_BUDGET',
        timeConfig
      } as const)
  },
  indicator: {
    timeSeries: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'INDICATOR_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
      } as const)
  },
  traffic: {
    timeSeries: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'TRAFFIC_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
      } as const)
  },
  totalTraffic: {
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'TOTAL_TRAFFIC',
        timeConfig
      } as const)
  },
  trafficPerSecond: {
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'SINGLE_NUMBER',
        metric: 'TRAFFIC_PER_SECOND',
        timeConfig
      } as const)
  }
});

export const applicationMetrics = deepFreeze({
  calls: {
    label: t('in-service-levels:general.metrics.calls'),
    singleNumber: ({
      entity,
      tagFilterExpression,
      timeConfig,
      aggregation = 'SUM'
    }: ApplicationMetricConfigGeneratorProps) =>
      ({
        source: 'APPLICATION',
        dataSource: 'CALLS',
        tagFilterExpression,
        timeShift: { offset: 0 },
        includeInternal: Boolean(entity.includeInternal),
        includeSynthetic: Boolean(entity.includeSynthetic),
        metric: 'calls',
        aggregation,
        resultType: 'SINGLE_NUMBER',
        queryPrecision: 'FULL',
        timeConfig
      } as const)
  },
  latency: {
    label: t('in-service-levels:general.metrics.latency')
  },
  errorRate: {
    label: t('in-service-levels:general.metrics.errors')
  },
  erroneousCalls: {
    label: t('in-service-levels:general.metrics.erroneousCalls')
  }
});

export const websiteMetrics = deepFreeze({
  beaconCount: {
    label: t('in-service-levels:general.metrics.beaconCount'),
    singleNumber: ({ entity, tagFilterExpression, timeConfig }: WebsiteMetricConfigGeneratorProps) =>
      ({
        source: 'WEBSITE',
        metric: 'beaconCount',
        aggregation: 'SUM',
        beaconType: entity.beaconType,
        tagFilterExpression,
        timeShift: { offset: 0 },
        timeConfig,
        resultType: 'SINGLE_NUMBER'
      } as const)
  },

  beaconDuration: {
    label: t('in-service-levels:general.metrics.beaconDuration')
  },

  beaconErrorRate: {
    label: t('in-service-levels:general.metrics.beaconErrorRate')
  },

  beaconErrorCount: {
    label: t('in-service-levels:general.metrics.beaconErrorCount')
  }
});

export const sloPreviewMetrics = deepFreeze({
  status: {
    label: t('in-service-levels:general.metrics.status'),
    singleNumber: ({ config, timeConfig }: SloPreviewConfigGeneratorProps) =>
      ({
        aggregation: 'MEAN',
        config,
        metric: 'STATUS',
        resultType: 'SINGLE_NUMBER',
        source: 'SLO_PREVIEW',
        timeShift: { offset: 0 },
        timeConfig
      } as const)
  },

  remainingBudget: {
    label: t('in-service-levels:general.metrics.remainingBudget'),
    singleNumber: ({ config, timeConfig }: SloPreviewConfigGeneratorProps) =>
      ({
        aggregation: 'MEAN',
        config,
        metric: 'ERROR_BUDGET_REMAINING',
        resultType: 'SINGLE_NUMBER',
        source: 'SLO_PREVIEW',
        timeConfig,
        timeShift: { offset: 0 }
      } as const),
    timeSeries: ({ config, timeConfig }: SloPreviewConfigGeneratorProps) =>
      ({
        aggregation: 'MEAN',
        config,
        granularity: calculateSloGranularity(timeConfig),
        metric: 'ERROR_BUDGET_REMAINING_CHART',
        resultType: 'TIME_SERIES',
        source: 'SLO_PREVIEW',
        timeConfig,
        timeShift: { offset: 0 }
      } as const)
  },

  consumedBudget: {
    label: t('in-service-levels:general.metrics.consumedBudget'),
    singleNumber: ({ config, timeConfig }: SloPreviewConfigGeneratorProps) =>
      ({
        aggregation: 'MEAN',
        config,
        metric: 'CONSUMED_ERROR_BUDGET_CHART',
        resultType: 'SINGLE_NUMBER',
        source: 'SLO_PREVIEW',
        timeConfig,
        timeShift: { offset: 0 }
      } as const)
  }
});

export const syntheticMetrics = deepFreeze({
  responseTime: {
    label: t('in-service-levels:general.metrics.latency')
  },
  allTests: {
    label: t('in-service-levels:general.indicator.trafficTypeLabel', {
      entityType: 'synthetic',
      trafficType: 'all'
    })
  },
  erroneousTests: {
    label: t('in-service-levels:general.indicator.trafficTypeLabel', {
      entityType: 'synthetic',
      trafficType: 'erroneous'
    })
  },
  failureRate: {
    label: t('in-service-levels:general.metrics.failureRate')
  }
});
