import React from 'react';

import stairway, { hourlyBudgetMetricId } from 'in-custom-dashboards/widgets/Slo/renderer/stairway';
import { groupByEndpointName, groupByServiceName } from 'in-analyze/AnalyzeView/dataSources';
import getJumpToAnalyzeHref$ from 'in-applications/components/getJumpToAnalyzeHref';
import { getSliFormatter } from 'in-custom-dashboards/widgets/Slo/sliConfigUtils';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import theme from 'in-themes';

export default function Chart({ result, timeConfig, consumed, hourlyBudget, budget, sliEntity, isPreview }) {
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
        granularity: 3600 * 1000,
        timeConfig: timeConfig,
        y1: {
          metricIds: ['consumed', hourlyBudgetMetricId],
          labels: ['Spent', 'Budget'],
          icons: {
            types: ['lib_flame', 'lib_actions_stop']
          },
          colors: [theme.lib.colors.blue800, theme.lib.colors.red800],
          renderer: stairway,
          metrics: [...metrics],
          formatter: getSliFormatter(sliEntity),
          isStaticBudget
        },
        nonInteractive: isPreview,
        ...getCustomAnalyzeContextMenuProperties(sliEntity)
      }}
    />
  );
}

function getCustomAnalyzeContextMenuProperties(sliEntity) {
  if (!sliEntity) {
    return {}; // use defaults
  }

  return {
    primaryContextMenuAction: 'analyze',
    additionalContextMenuButtons: [
      {
        name: 'analyze',
        icon: 'lib_analyze',
        label: 'View in Analytics',
        getHref$: highlightedTime =>
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
                sliEntity.serviceId == null && sliEntity.endpointId == null ? groupByServiceName : groupByEndpointName
            }
          )
      }
    ]
  };
}
