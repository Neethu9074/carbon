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
import { t } from '@instana/i18n-react';

import { calculateSloGranularity } from 'in-service-levels/utils/time';
import { deepFreeze } from 'in-services/util/object';

interface SloMetricConfigGeneratorProps {
  configId: string;
  timeConfig: TimeConfig;
  granularity?: number;
}

type TimeSeriesGenerator<T> = T & { granularity: number };

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

  consumedBudget: {
    label: t('in-service-levels:general.metrics.consumedBudget'),
    timeSeries: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'CONSUMED_ERROR_BUDGET_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
      } as const),
    singleNumber: ({ configId, timeConfig }: SloMetricConfigGeneratorProps) =>
      ({
        aggregation: 'MEAN',
        configId,
        metric: 'CONSUMED_ERROR_BUDGET_CHART',
        resultType: 'SINGLE_NUMBER',
        source: 'SLO',
        timeConfig,
        timeShift: { offset: 0 }
      } as const)
  },

  momentaryConsumption: {
    label: t('in-service-levels:general.metrics.momentaryBudgetConsumption'),
    timeSeries: ({ configId, timeConfig, granularity }: SloMetricConfigGeneratorProps) =>
      ({
        timeShift: { offset: 0 },
        aggregation: 'MEAN',
        source: 'SLO',
        configId,
        resultType: 'TIME_SERIES',
        metric: 'ERROR_CHART',
        timeConfig,
        granularity: granularity ?? calculateSloGranularity(timeConfig)
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
      } as const),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity
    }: TimeSeriesGenerator<ApplicationMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation: 'SUM',
        source: 'APPLICATION',
        dataSource: 'CALLS',
        tagFilterExpression,
        timeShift: { offset: 0 },
        includeInternal: Boolean(entity.includeInternal),
        includeSynthetic: Boolean(entity.includeSynthetic),
        metric: 'calls',
        resultType: 'TIME_SERIES',
        queryPrecision: 'FULL',
        timeConfig
      } as const)
  },

  latency: {
    label: t('in-service-levels:general.metrics.latency'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation = 'P99'
    }: TimeSeriesGenerator<ApplicationMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation,
        source: 'APPLICATION',
        dataSource: 'CALLS',
        tagFilterExpression,
        timeShift: { offset: 0 },
        includeInternal: Boolean(entity.includeInternal),
        includeSynthetic: Boolean(entity.includeSynthetic),
        metric: 'latency',
        resultType: 'TIME_SERIES',
        queryPrecision: 'FULL',
        timeConfig
      } as const)
  },

  errorRate: {
    label: t('in-service-levels:general.metrics.errors'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation = 'P99'
    }: TimeSeriesGenerator<ApplicationMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation,
        source: 'APPLICATION',
        dataSource: 'CALLS',
        tagFilterExpression,
        timeShift: { offset: 0 },
        includeInternal: Boolean(entity.includeInternal),
        includeSynthetic: Boolean(entity.includeSynthetic),
        metric: 'errors',
        resultType: 'TIME_SERIES',
        queryPrecision: 'FULL',
        timeConfig
      } as const)
  },

  erroneousCalls: {
    label: t('in-service-levels:general.metrics.erroneousCalls'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity
    }: TimeSeriesGenerator<ApplicationMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation: 'SUM',
        source: 'APPLICATION',
        dataSource: 'CALLS',
        tagFilterExpression,
        timeShift: { offset: 0 },
        includeInternal: Boolean(entity.includeInternal),
        includeSynthetic: Boolean(entity.includeSynthetic),
        metric: 'erroneousCalls',
        resultType: 'TIME_SERIES',
        queryPrecision: 'FULL',
        timeConfig
      } as const)
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
      } as const),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity
    }: TimeSeriesGenerator<WebsiteMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation: 'SUM',
        source: 'WEBSITE',
        metric: 'beaconCount',
        beaconType: entity.beaconType,
        tagFilterExpression,
        timeShift: { offset: 0 },
        timeConfig,
        resultType: 'TIME_SERIES'
      } as const)
  },

  beaconDuration: {
    label: t('in-service-levels:general.metrics.beaconDuration'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation = 'P99'
    }: TimeSeriesGenerator<WebsiteMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation,
        source: 'WEBSITE',
        metric: 'beaconDuration',
        beaconType: entity.beaconType,
        tagFilterExpression,
        timeShift: { offset: 0 },
        timeConfig,
        resultType: 'TIME_SERIES'
      } as const)
  },

  beaconErrorRate: {
    label: t('in-service-levels:general.metrics.beaconErrorRate'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity,
      aggregation = 'P99'
    }: TimeSeriesGenerator<WebsiteMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation,
        source: 'WEBSITE',
        metric: 'beaconErrorRate',
        beaconType: entity.beaconType,
        tagFilterExpression,
        timeShift: { offset: 0 },
        timeConfig,
        resultType: 'TIME_SERIES'
      } as const)
  },

  beaconErrorCount: {
    label: t('in-service-levels:general.metrics.beaconErrorCount'),
    timeSeries: ({
      entity,
      tagFilterExpression,
      timeConfig,
      granularity
    }: TimeSeriesGenerator<WebsiteMetricConfigGeneratorProps>) =>
      ({
        granularity,
        aggregation: 'SUM',
        source: 'WEBSITE',
        metric: 'beaconErrorCount',
        beaconType: entity.beaconType,
        tagFilterExpression,
        timeShift: { offset: 0 },
        timeConfig,
        resultType: 'TIME_SERIES'
      } as const)
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
