import PropTypes from 'prop-types';
import React from 'react';

import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { defaultGranularity } from 'in-new-components/PotentialProblems/constants';
import { hoursToMillis } from 'in-new-components/Alerting/utils/formatUtils';
import AlertingChart from 'in-new-components/Alerting/Chart/AlertingChart';

export default function PotentialProblemChart({ applicationId, threshold, rule, tagFilters, alert, alertType }) {
  return (
    <AlertingChart
      alertConfig={{
        threshold,
        rule,
        tagFilters: tagFilters.filter(({ name }) => name !== 'application.id'),
        applicationId,
        granularity: defaultGranularity
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
    const duration = Math.max(alert.end - alert.start, hoursToMillis(12));
    const to = alert.start + duration / 2;

    return {
      to,
      focusedMoment: to,
      windowSize: duration
    };
  }
}

PotentialProblemChart.propTypes = {
  alert: alertPropType.isRequired,
  alertType: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired,
  rule: rulePropType.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired,
  threshold: thresholdPropType.isRequired
};
