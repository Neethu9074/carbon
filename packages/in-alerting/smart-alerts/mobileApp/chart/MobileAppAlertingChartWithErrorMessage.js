/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Message, Spacer } from '@instana/components';

import { useFetchAdaptiveBaselineOrUseFallbackFromEvent } from 'in-alerting/smart-alerts/mobileApp/hooks/useFetchAdaptiveBaselineOrUseFallbackFromEvent';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { t, Trans } from 'in-i18n';

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
export default function MobileAppAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, isEventsView, isAlertDetailView } = props;

  const { threshold } = alertConfigWithFormModel;

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

function ChartWithErrorMessageAndData(props) {
  const { alertConfigWithFormModel } = props;
  const { threshold, rule, mobileAppId } = alertConfigWithFormModel;
  const { metricName, alertType } = rule;
  const blueprintConfig = getBlueprintConfig(alertType);
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const isAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(mobileAppId, beaconType, threshold.type);

    return createIsAlertQueryValid(isQueryValid);
  }, [mobileAppId, beaconType, threshold.type]);

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

MobileAppAlertingChartWithErrorMessage.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.shape({
    eventBasedAdaptiveBaseline: PropTypes.array,
    id: PropTypes.string.isRequired,
    created: PropTypes.number,
    mobileAppId: PropTypes.string.required,
    rule: PropTypes.shape({
      alertType: PropTypes.string,
      metricName: PropTypes.string
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
