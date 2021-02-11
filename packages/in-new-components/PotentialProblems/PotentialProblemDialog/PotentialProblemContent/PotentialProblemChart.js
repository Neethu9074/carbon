/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-new-components/PotentialProblems/PotentialProblemsLane/proptypes';
import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import { createDefaultChartConfig } from 'in-new-components/Alerting/Chart/chartViewConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { getBlueprintConfig } from 'in-applications/alerting/data/blueprintConfig';
import { defaultGranularity } from 'in-new-components/PotentialProblems/constants';
import { hours } from 'in-services/time';

export default function PotentialProblemChart({
  applicationId,
  boundaryScope,
  threshold,
  rule,
  tagFilters,
  tagFilterExpression,
  alert,
  alertType
}) {
  const blueprintConfig = getBlueprintConfig(alertType);
  const alertConfig = {
    threshold,
    rule,
    tagFilters: tagFilters.filter(({ name }) => name !== 'application.id'),
    applicationId,
    boundaryScope,
    granularity: defaultGranularity,
    tagFilterExpression: fromBackendModel(tagFilterExpression)
  };

  return (
    <AlertingChartWithErrorMessage
      alertConfigWithFormModel={alertConfig}
      viewConfig={{
        ...createDefaultChartConfig(getTimeConfig()),
        smoothMetric: false
      }}
      blueprintConfig={blueprintConfig}
    />
  );

  /**
   * Behaviour of this function is partly from getChartTimeConfigByEvent()
   * But some parts which we don't need are omitted, because we want to mimic the behaviour
   * of the timeConfig for the Chart in "in-events/components/EventContent/ApplicationEventContent" (L43-L46)
   */
  function getTimeConfig() {
    const duration = Math.max(alert.end - alert.start, hours.toMillis(12));
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
  boundaryScope: PropTypes.string.isRequired,
  rule: rulePropType.isRequired,
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired,
  tagFilterExpression: PropTypes.object.isRequired,
  threshold: thresholdPropType.isRequired
};
