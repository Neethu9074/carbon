/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Observable, just } from '@instana/observables';

import {
  isApplicationSliConfig,
  isAvailabilitySliConfig,
  isWebsiteEventBasedSliEntity,
  isWebsiteSliEntity,
  SliConfig
} from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import {
  ApplicationSliEntity,
  AvailabilitySliEntity,
  MetricResult,
  Result,
  SliConfigurationWithLastUpdated,
  TagCatalog,
  TagFilter,
  TimeConfig
} from 'in-types';
import getJumpDirectlyToApplicationLikeUA2Href$ from 'in-custom-dashboards/widgets/Slo/getJumpDirectlyToApplicationLikeUA2Href';
import { getEmptyTagFilterExpression } from 'in-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import { tagFilter, toNewTagFilterFormat } from 'in-components/QueryBuilder/transformation/tagFilter';
import { trackJumpToUnboundedAnalyticsFromSloWidget } from 'in-custom-dashboards/widgets/Slo/tracker';
import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { EQUALS, GREATER_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliFormatter';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { createChartedMetric } from 'in-analyze/navigation/paths';
import { ChartedMetric } from 'in-applications/navigation/paths';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { Axis } from 'in-components/Chart/ResultAwareChart.d';
import { entityTypes } from 'in-analyze/applicationFilter';
import theme from 'in-themes';
import { t } from 'in-i18n';

interface ChartProps {
  result: Result<MetricResult[]>;
  timeConfig: TimeConfig;
  granularity: number;
  consumed: [number, number][];
  hourlyBudget: [number, number][];
  budget: number;
  sliConfig: SliConfigurationWithLastUpdated;
  isPreview?: boolean;
  disableZooming?: boolean;
}

export default function Chart({
  result,
  timeConfig,
  granularity,
  consumed,
  hourlyBudget,
  budget,
  sliConfig,
  isPreview,
  disableZooming
}: ChartProps) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const isStaticBudget = hourlyBudget === null || hourlyBudget.length === 0;

  let metrics: Axis['metrics'] = [consumed, hourlyBudget];

  if (isStaticBudget) {
    // TODO replace with a more elegant way, by moving this feature into the renderer
    metrics = [consumed, consumed.map<[number, number]>(timeValue => [timeValue[0], budget])];
  }

  return (
    <ResultAwareChart
      result={result}
      config={{
        granularity,
        timeConfig,
        customHeight: 50,
        y1: {
          metricIds: ['consumed', hourlyBudgetMetricId],
          labels: [
            t('in-custom-dashboards:widgets.slo.chart.spent'),
            t('in-custom-dashboards:widgets.slo.chart.budget')
          ],
          icons: {
            types: ['lib_flame', 'lib_actions_stop']
          },
          colors: [theme.lib.colors.blue800, theme.lib.colors.red800],
          renderer: stairway,
          metrics: [...metrics],
          formatter: getSliFormatter(sliConfig?.sliEntity),
          isStaticBudget
        },
        nonInteractive: isPreview,
        ...getCustomAnalyzeContextMenuProperties(sliConfig, disableZooming, tagCatalog)
      }}
    />
  );
}

function getCustomAnalyzeContextMenuProperties(
  sliConfig: SliConfigurationWithLastUpdated,
  disableZooming?: boolean,
  tagCatalog?: TagCatalog
) {
  if (!sliConfig || !tagCatalog) {
    return {}; // use defaults
  }

  let onClick;
  if (isAvailabilitySliConfig(sliConfig) || isApplicationSliConfig(sliConfig)) {
    const { sliType, applicationId, serviceId, endpointId, boundaryScope } = sliConfig.sliEntity;
    onClick = () =>
      trackJumpToUnboundedAnalyticsFromSloWidget({
        sliType,
        applicationId,
        serviceId,
        endpointId,
        boundaryScope
      });
  }

  return {
    primaryContextMenuAction: 'analyze',
    excludedContextMenuActions: disableZooming ? ['zoomIn'] : [],
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: t('in-custom-dashboards:widgets.slo.chart.viewInAnalyze'),
        allowClickPropagationAndDefault: true,
        onClick,
        getHref$: (highlightedTime: TimeConfig) => getLinkToUnboundAnalytics(sliConfig, tagCatalog, highlightedTime)
      }
    ]
  };
}

function getLinkToUnboundAnalytics(
  sliConfig: SliConfigurationWithLastUpdated,
  tagCatalog: TagCatalog,
  highlightedTime: TimeConfig
): Observable<string> | undefined {
  if (isAvailabilitySliConfig(sliConfig)) {
    return buildAvailabilitySliEntityUA2Link(sliConfig, highlightedTime);
  }

  if (isApplicationSliConfig(sliConfig)) {
    return buildApplicationSliEntityUA2Link(sliConfig, tagCatalog, highlightedTime);
  }

  if (isWebsiteSliEntity(sliConfig)) {
    // TODO: soon to be implemented
    return just('');
  }

  if (isWebsiteEventBasedSliEntity(sliConfig)) {
    // TODO: soon to be implemented
    return just('');
  }

  return just('');
}

function getAdditionalFiltersForApplicationSli(sliConfig: SliConfig<ApplicationSliEntity>): [] | TagFilter[] {
  const { metricConfiguration } = sliConfig;

  switch (metricConfiguration?.metricName) {
    case 'latency': {
      const thresholdValue = metricConfiguration.threshold;
      return [tagFilter('call.latency', GREATER_THAN, thresholdValue)];
    }
    case 'errors':
    case 'erroneousCalls':
      return [tagFilter('call.erroneous', EQUALS, true)];
    case 'calls':
    default:
      // no filter to add
      return [];
  }
}

function getChartsParam(sliConfig: SliConfigurationWithLastUpdated): ChartedMetric[] {
  if (isApplicationSliConfig(sliConfig)) {
    const metricName = sliConfig.metricConfiguration?.metricName;
    if (metricName === 'latency') {
      return [createChartedMetric('latency', 'DISTRIBUTION')];
    }
  }
  return [createChartedMetric('calls', 'SUM')];
}

interface EntityIds {
  readonly applicationId?: string;
  readonly serviceId?: string;
  readonly endpointId?: string;
}
function getGroupByParam(enityIds: EntityIds) {
  const groupbyTag = enityIds.serviceId == null && enityIds.endpointId == null ? 'service.name' : 'endpoint.name';
  return {
    groupbyTagEntity: entityTypes.DESTINATION,
    groupbyTag
  };
}

function buildAvailabilitySliEntityUA2Link(sliConfig: SliConfig<AvailabilitySliEntity>, highlightedTime: TimeConfig) {
  const {
    boundaryScope,
    includeInternal,
    includeSynthetic,
    badEventFilterExpression = getEmptyTagFilterExpression(),
    ...remainingSliEntityProps
  } = sliConfig.sliEntity;

  const additionalParams = {
    timeConfig: highlightedTime,
    groupBy: getGroupByParam(remainingSliEntityProps),
    hiddenCalls: { includeInternal, includeSynthetic },
    chartedMetrics: getChartsParam(sliConfig)
  } as const;

  return getJumpDirectlyToApplicationLikeUA2Href$(
    remainingSliEntityProps,
    badEventFilterExpression,
    [],
    boundaryScope,
    additionalParams
  );
}

function buildApplicationSliEntityUA2Link(
  sliConfig: SliConfig<ApplicationSliEntity>,
  tagCatalog: TagCatalog,
  highlightedTime: TimeConfig
): Observable<string> {
  const filters = getAdditionalFiltersForApplicationSli(sliConfig);
  const { boundaryScope, ...remainingSliEntityProps } = sliConfig.sliEntity;

  const additionalParams = {
    timeConfig: highlightedTime,
    groupBy: getGroupByParam(remainingSliEntityProps),
    chartedMetrics: getChartsParam(sliConfig)
  };

  return getJumpDirectlyToApplicationLikeUA2Href$(
    remainingSliEntityProps,
    getEmptyTagFilterExpression(),
    filters.map(f => toNewTagFilterFormat(f, tagCatalog)),
    boundaryScope,
    additionalParams
  );
}
