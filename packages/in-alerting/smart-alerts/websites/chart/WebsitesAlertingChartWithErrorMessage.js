/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Spacer, Message } from '@instana/components';

import { useFetchAdaptiveBaselineOrUseFallbackFromEvent } from 'in-alerting/smart-alerts/websites/hooks/useFetchAdaptiveBaselineOrUseFallbackFromEvent';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t, Trans } from 'in-i18n';

export default function WebsitesAlertingChartWithErrorMessage(props) {
  const {
    alertConfigWithFormModel: { threshold },
    isEventsView,
    isAlertDetailView
  } = props;

  // fetch persistent baseline?
  if (threshold?.type === ADAPTIVE_BASELINE && (isAlertDetailView || isEventsView)) {
    return <AlertingChartWithErrorMessageForAdaptiveBaseline {...props} />;
  }

  return <ChartWithErrorMessageAndData {...props} />;
}

function AlertingChartWithErrorMessageForAdaptiveBaseline(props) {
  const { error, baseline } = useFetchAdaptiveBaselineOrUseFallbackFromEvent(props);
  return (
    <>
      <ChartWithErrorMessageAndData {...props} eventBasedAdaptiveBaseline={baseline} />
      {error && (
        <>
          <Spacer size="normal" />
          <Message type="warning" withIcon small>
            <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessageNotAvailable" />
          </Message>
        </>
      )}
    </>
  );
}

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
function ChartWithErrorMessageAndData(props) {
  const { alertConfigWithFormModel } = props;

  const { threshold, rule, websiteId } = alertConfigWithFormModel;
  const { metricName, alertType } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const isAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(websiteId, beaconType, threshold.type);

    return createIsAlertQueryValid(isQueryValid);
  }, [websiteId, beaconType, threshold.type]);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      getErrorMessage={isValidDependingOnMode => getErrorMessage(!isValidDependingOnMode)}
      queryValidator={isAlertQueryValid}
    />
  );
}

function getErrorMessage(isQB2Error) {
  if (isQB2Error) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
}

WebsitesAlertingChartWithErrorMessage.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.shape({
    eventBasedAdaptiveBaseline: PropTypes.array,
    id: PropTypes.string.isRequired,
    created: PropTypes.number,
    websiteId: PropTypes.string.required,
    rule: PropTypes.shape({
      alertType: PropTypes.string
    }),
    threshold: PropTypes.object,
    builtIn: PropTypes.bool
  }).isRequired,

  // enables rendering of a persisted baseline:
  isEventsView: PropTypes.bool,
  // enables rendering of a persisted baseline:
  isAlertDetailView: PropTypes.bool,

  setMetricResultPrecision: PropTypes.func
};
