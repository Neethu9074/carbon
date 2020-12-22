import theme from 'in-themes';
import React from 'react';

import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { availabilityType, applicationType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import { EQUALS, GREATER_THAN } from 'in-new-components/QueryBuilder/tagFilter/operators';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliFormatter';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import useTagCatalog from 'in-applications/hooks/useTagCatalog';
import { convertToAnalyzeFilters } from 'in-applications/tags';

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
          labels: ['Spent', 'Budget'],
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

  const sliEntity = sliConfig.sliEntity;
  const filters = getAnalyzeFilters(sliConfig);

  return {
    primaryContextMenuAction: 'analyze',
    excludedContextMenuActions: disableZooming ? ['zoomIn'] : [],
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: 'View in Analyze',
        getHref$: highlightedTime =>
          tagCatalog &&
          getJumpToAnalyzeHref$(
            {
              applicationId: sliEntity.applicationId,
              serviceId: sliEntity.serviceId,
              endpointId: sliEntity.endpointId
            },
            {
              timeConfig: highlightedTime,
              boundaryScope: sliEntity.boundaryScope,
              groupByTag:
                sliEntity.serviceId == null && sliEntity.endpointId == null ? groupByServiceName : groupByEndpointName,
              focusedMetric: getFocusedMetric(sliConfig),
              filters,
              tagCatalog: tagCatalog
            }
          )
      }
    ]
  };
}

function getAnalyzeFilters(sliConfig) {
  const filters = [];
  const sliEntity = sliConfig.sliEntity;
  if (sliEntity.sliType === availabilityType) {
    const badAnalyzeFilters = convertToAnalyzeFilters(sliEntity.badEventFilters ?? []);
    filters.push(...badAnalyzeFilters);
  } else if (sliEntity.sliType === applicationType) {
    switch (sliConfig.metricConfiguration.metricName) {
      case 'latency': {
        const thresholdValue = sliConfig.metricConfiguration.threshold;
        filters.push(createAnalyzeFilter('call.latency', GREATER_THAN, thresholdValue));
        break;
      }
      case 'errors':
      case 'erroneousCalls':
        filters.push(createAnalyzeFilter('call.erroneous', EQUALS, true));
        break;
      case 'calls':
      default:
        // no filter to add
        break;
    }
  }
  return filters;
}

function createAnalyzeFilter(name, operator, value) {
  return { name, operator, value };
}

function getFocusedMetric(sliConfig) {
  if (sliConfig.sliEntity.sliType === 'application') {
    const metricName = sliConfig.metricConfiguration.metricName;
    if (metricName === 'latency') {
      return 'latency_DISTRIBUTION';
    }
  }
  return 'calls_SUM';
}
