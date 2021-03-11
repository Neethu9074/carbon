/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import { t } from 'in-i18n';
import React from 'react';

import { trackJumpToUnboundedAnalyticsFromSloWidget } from 'in-custom-dashboards/widgets/Slo/tracker';
import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { availabilityType, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import getJumpDirectlyToUA2Href$ from 'in-custom-dashboards/widgets/Slo/getJumpDirectlyToUA2Href';
import { toNewTagFilterFormat } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { EQUALS, GREATER_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliFormatter';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { entityTypes } from 'in-analyze/applicationFilter';

const emptyTagFilterExpression = { type: 'EXPRESSION', logicalOperator: 'AND', elements: [] };

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
}) {
  const tagCatalog = useTagCatalog(getTagCatalog);
  const isStaticBudget = hourlyBudget === null || hourlyBudget.length === 0;
  let metrics = [consumed, hourlyBudget];
  if (isStaticBudget) {
    // TODO replace with a more elegant way, by moving this feature into the renderer
    metrics = [consumed, consumed.map(timeValue => [timeValue[0], budget])];
  }

  return (
    <ResultAwareChart
      cardUseMaxAvailableHeight={false}
      withoutPadding={false}
      customHeight={50}
      result={result}
      config={{
        granularity,
        timeConfig,
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

function getCustomAnalyzeContextMenuProperties(sliConfig, disableZooming, tagCatalog) {
  if (!sliConfig) {
    return {}; // use defaults
  }

  const { sliEntity } = sliConfig;

  return {
    primaryContextMenuAction: 'analyze',
    excludedContextMenuActions: disableZooming ? ['zoomIn'] : [],
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: t('in-custom-dashboards:widgets.slo.chart.viewInAnalyze'),
        allowClickPropagationAndDefault: true,
        onClick() {
          trackJumpToUnboundedAnalyticsFromSloWidget({
            sliType: sliEntity.sliType,
            applicationId: sliEntity.applicationId,
            serviceId: sliEntity.serviceId,
            endpointId: sliEntity.endpointId,
            boundaryScope: sliEntity.boundaryScope
          });
        },
        getHref$: highlightedTime => getLinkToUnboundAnalytics(sliConfig, tagCatalog, highlightedTime)
      }
    ]
  };
}

function getLinkToUnboundAnalytics(sliConfig, tagCatalog, highlightedTime) {
  const sliEntity = sliConfig.sliEntity;
  const boundaryScope = sliEntity.boundaryScope;

  let tagFilterExpression;
  let filters;
  if (sliEntity.sliType === availabilityType) {
    tagFilterExpression = sliEntity.badEventFilterExpression;
    filters = [];
  } else {
    // application
    tagFilterExpression = emptyTagFilterExpression;
    filters = getAdditionalFiltersForApplicationSli(sliConfig);
  }

  return getJumpDirectlyToUA2Href$(
    {
      applicationId: sliEntity.applicationId,
      serviceId: sliEntity.serviceId,
      endpointId: sliEntity.endpointId
    },
    tagFilterExpression,
    filters.map(f => toNewTagFilterFormat(f, tagCatalog)),
    boundaryScope,
    {
      timeConfig: highlightedTime,
      groupBy: getGroupByParam(sliEntity),
      hiddenCalls: {
        includeInternal: sliEntity.includeInternal,
        includeSynthetic: sliEntity.includeSynthetic
      },
      charts: getChartsParam(sliConfig)
    }
  );
}

function getAdditionalFiltersForApplicationSli(sliConfig) {
  const { sliEntity, metricConfiguration } = sliConfig;

  if (sliEntity.sliType !== applicationType) {
    return [];
  }

  switch (metricConfiguration.metricName) {
    case 'latency': {
      const thresholdValue = metricConfiguration.threshold;
      return [createAnalyzeFilter('call.latency', GREATER_THAN, thresholdValue)];
    }
    case 'errors':
    case 'erroneousCalls':
      return [createAnalyzeFilter('call.erroneous', EQUALS, true)];
    case 'calls':
    default:
      // no filter to add
      return [];
  }
}

function createAnalyzeFilter(name, operator, value) {
  return { name, operator, value };
}

function getChartsParam(sliConfig) {
  if (sliConfig.sliEntity.sliType === 'application') {
    const metricName = sliConfig.metricConfiguration.metricName;
    if (metricName === 'latency') {
      return [
        {
          metric: 'latency',
          aggregation: 'DISTRIBUTION'
        }
      ];
    }
  }
  return [
    {
      metric: 'calls',
      aggregation: 'SUM'
    }
  ];
}

function getGroupByParam(sliEntity) {
  const groupbyTag = sliEntity.serviceId == null && sliEntity.endpointId == null ? 'service.name' : 'endpoint.name';
  return {
    groupbyTagEntity: entityTypes.DESTINATION,
    groupbyTag
  };
}
