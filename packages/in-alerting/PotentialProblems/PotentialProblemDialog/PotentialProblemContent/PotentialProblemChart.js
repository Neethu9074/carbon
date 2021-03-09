/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/components/smart-alert-dialog/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import { hours } from 'in-services/time';

export default function PotentialProblemChart({
  applicationId,
  boundaryScope,
  applications,
  threshold,
  rule,
  tagFilterExpression,
  includeSynthetic = false,
  alert,
  alertType
}) {
  const blueprintConfig = getBlueprintConfig(alertType);
  const alertConfig = {
    threshold,
    rule,
    applicationId,
    boundaryScope,
    applications,
    granularity: defaultGranularity,
    tagFilterExpression: fromBackendModel(tagFilterExpression),
    includeSynthetic
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
  tagFilterExpression: PropTypes.object.isRequired,
  includeSynthetic: PropTypes.bool,
  applications: applicationsItemTreePropType,
  threshold: thresholdPropType.isRequired
};
