/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { IconButton } from '@instana/components';

import {
  enclose,
  FormModelElement,
  fromBackendModel,
  joinExpressions
} from 'in-components/QueryBuilder/transformation/formModel';
import { TagFilterExpressionElementUnion, UnifiedMetricConfigurationUnion, Grouping } from 'in-types';
import { isEmptyExpression } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { Config as BigNumberConfig } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { ANALYZE_CUSTOM_WIDGET_SEE_IN_LOGS_CLICKED } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useLinkToLogs } from 'in-logging/navigation/paths';
import { ChartConfig } from 'in-components/Chart/types';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

type MetricsConfig = ChartConfig | BigNumberConfig<UnifiedMetricConfigurationUnion>;

interface LogMetricsTagExpresionItem {
  filters: FormModelElement[];
  groups?: Grouping[];
}

export function ViewLogsButton({ config, className = '' }: { config: MetricsConfig; className?: string }) {
  const isLogsWidget = containsLogMetrics(config);

  const logMetricTagExpressions = getLogMetricsTagExpressions(config);
  const { filters, groups } = logMetricTagExpressions;

  const link = useLinkToLogs({ tagFilterExpression: filters as FormModelElement[], groups });

  const { trackCta } = useSegmentTracking();
  if (!isLogsWidget) return null;

  return (
    <Tooltip content={t('in-forge:plugins.docker.dashboard.seeLogsInAnalyze')}>
      <IconButton
        href={link}
        className={className}
        onClick={() =>
          trackCta(ANALYZE_CUSTOM_WIDGET_SEE_IN_LOGS_CLICKED, {
            source: `See logs in Analyze - Custom Dashboard`,
            navigationLink: link,
            filters
          })
        }
        kind="action"
        size={'compact'}
        type="lib_analyze"
      />
    </Tooltip>
  );
}

function containsLogMetrics(config: MetricsConfig) {
  return (
    (config as BigNumberConfig<UnifiedMetricConfigurationUnion>).metricConfiguration?.source === 'LOG' ||
    Object.values(config).some(
      value =>
        Array.isArray(value?.metrics) && value.metrics.some((metric: { source: string }) => metric.source === 'LOG')
    )
  );
}

/* Extract tag filters from widget config */
function getLogMetricsTagExpressions(config: MetricsConfig): LogMetricsTagExpresionItem {
  const expressions: any[] = [];
  const grouping: Grouping[] = [];

  const extractExpression = (metric: {
    source: string;
    tagFilterExpression: TagFilterExpressionElementUnion;
    grouping: Grouping;
  }) => {
    if (metric.source === 'LOG' && !isEmptyExpression(metric.tagFilterExpression)) {
      expressions.push(metric.tagFilterExpression as FormModelElement);
    }
    if (metric.source === 'LOG' && metric.grouping) {
      grouping.push({ ...metric.grouping });
    }
  };

  Object.values(config).forEach(value => {
    if (Array.isArray(value?.metrics)) {
      value.metrics.forEach(extractExpression);
    } else if (value?.source === 'LOG' && !isEmptyExpression(value.tagFilterExpression)) {
      expressions.push(value.tagFilterExpression);
    }
  });

  const filters =
    expressions.length > 1
      ? joinExpressions({ expressions, logicalOperator: 'OR' }).flatMap((element: any) =>
          element.elements ? enclose(fromBackendModel(element)) : [element]
        )
      : expressions.length === 1 && (expressions[0]?.type === 'TAG_FILTER' || 'EXPRESSION')
      ? expressions.flatMap(element => (element.elements ? enclose(fromBackendModel(element)) : [element]))
      : [];
  const groups: Grouping[] = grouping.flatMap(item => Object.values(item));

  return {
    filters,
    groups
  };
}
