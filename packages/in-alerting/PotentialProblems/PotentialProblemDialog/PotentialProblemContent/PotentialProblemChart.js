/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { applicationsItemTreePropType } from 'in-alerting/smart-alerts/applications/scopeConfig/ServicesAndEndpointsListPresenter/sharedPropTypes';
import {
  alertPropType,
  rulePropType,
  thresholdPropType
} from 'in-alerting/PotentialProblems/PotentialProblemsLane/proptypes';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { createDefaultChartConfig } from 'in-alerting/components/Chart/chartViewConfig';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { defaultGranularity } from 'in-alerting/PotentialProblems/constants';
import Renderer from 'in-alerting/components/Chart/renderer/Renderer';
import { hexToRGBA } from 'in-themes/utils';
import { hours } from 'in-services/time';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function PotentialProblemChart({
  applicationId,
  boundaryScope,
  applications,
  threshold,
  rule,
  tagFilterExpression,
  includeSynthetic,
  includeInternal,
  alert,
  alertType
}) {
  const blueprintConfig = getBlueprintConfig(alertType);
  const alertConfig = {
    threshold,
    rule,
    applicationId, // TODO: remove it, it should already be part of applications...
    boundaryScope,
    applications,
    granularity: defaultGranularity,
    tagFilterExpression: fromBackendModel(tagFilterExpression),
    includeInternal,
    includeSynthetic
  };
  const highlightColor = theme.lib.colors.chart.strokeColors100[3];

  return (
    <AlertingChartWithErrorMessage
      alertConfigWithFormModel={alertConfig}
      viewConfig={{
        ...createDefaultChartConfig(getTimeConfig()),
        smoothMetric: false
      }}
      blueprintConfig={blueprintConfig}
      rendererOverride={Renderer.lineWithBaselineAndPotentialProblem}
      highlight={{
        area: alert,
        color: [hexToRGBA(highlightColor, 0.25), highlightColor],
        label: t('in-alerting:potentialProblems.titlePotentialProblem')
      }}
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
  applicationId: PropTypes.string,
  boundaryScope: PropTypes.string,
  rule: rulePropType.isRequired,
  tagFilterExpression: PropTypes.object.isRequired,
  includeInternal: PropTypes.bool,
  includeSynthetic: PropTypes.bool,
  applications: applicationsItemTreePropType,
  threshold: thresholdPropType.isRequired
};
