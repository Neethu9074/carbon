import PropTypes from 'prop-types';
import React from 'react';

import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
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
   * But some parts which we don't need are omitted, because we want to mimic the behaviour
   * of the timeConfig for the Chart in "in-events/components/EventContent/ApplicationEventContent" (L43-L46)
   */
  function getTimeConfig() {
    const duration = alert.end - alert.start;
    const to = alert.end + duration * 0.05;

    return {
      to,
      focusedMoment: to,
      windowSize: duration * 1.1
    };
  }
}

PotentialProblemChart.propTypes = {
  alert: PropTypes.shape({
    end: PropTypes.number,
    start: PropTypes.number
  }).isRequired,
  alertConfig: PropTypes.object.isRequired,
  alertType: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired
};
