import React from 'react';

import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { alertingEventDetailsChartTimeframe } from 'in-new-components/Alerting/constants';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';

export default function PotentialProblemChart({ applicationId, alertConfig, tagFilters, alert, alertType }) {
  return (
    <AlertingChart
      alertConfig={{
        ...alertConfig,
        tagFilters: tagFilters.filter(({ name }) => name !== 'application.id'),
        applicationId,
        granularity: 60000
      }}
      viewConfig={{
        ...createDefaultChartConfig(getTimeConfig()),
        smoothMetric: false
      }}
      blueprintConfig={getBlueprintConfig(alertType)}
    />
  );

  /**
   * Behaviour of this function is partly from getChartTimeConfigByEvent()
   * But some parts which we don't need are omitted, because we want to mimic the bhaviour
   * of the timeConfig for the Chart in "in-events/components/EventContent/ApplicationEventContent" (L43-L46)
   */
  function getTimeConfig() {
    const to = alert.end ? alert.end - 1000 * 60 : null;
    const isOpen = to == null;
    return {
      to,
      focusedMoment: to,
      windowSize: alertingEventDetailsChartTimeframe,
      autoRefresh: isOpen
    };
  }
}
