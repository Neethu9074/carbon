/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Message, Spacer } from '@instana/components';

import { useFetchAdaptiveBaselineOrUseFallbackFromEvent } from 'in-alerting/smart-alerts/applications/hooks/useFetchAdaptiveBaselineOrUseFallbackFromEvent';
import {
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import { WARNING_SEVERITY, CRITICAL_SEVERITY } from 'in-alerting/smart-alerts/components/utils/baselineUtils';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { t, Trans } from 'in-i18n';

const NoDataPlaceHolder = ({ text }) => <NoDataAvailable text={text} height={230} />;

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const {
    alertConfigWithFormModel: { evaluationType, threshold },
    serviceId,
    endpointId,
    isEventsView,
    isAlertDetailView
  } = props;

  if (PER_AP_ENDPOINT === evaluationType && !endpointId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataWithoutEndpointSelection')} />;
  }

  if (PER_AP_SERVICE === evaluationType && !serviceId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataAvailable')} />;
  }

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
          <Message type="warning" withIcon small fullInlineWidth>
            <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessageNotAvailable" />
          </Message>
        </>
      )}
    </>
  );
}

// Extracted, because it needs a memoization of the isQueryValid-method to avoid unneeded re-rendering
function ChartWithErrorMessageAndData(props) {
  const { alertConfigWithFormModel, isTearSheet } = props;

  const { alertType, thresholdType } = extractAlertConfigWithFormModel(alertConfigWithFormModel);
  const isApplicationAlertQueryValid = useMemo(() => {
    const { isQueryValid } = getQueryBuilderForAlertType(alertType, thresholdType);
    return ([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig);
  }, [alertType, thresholdType]);

  const entitySelection = alertConfigWithFormModel.applications;
  // If a user deselected all entities from entitySelection we have an empty object
  // If a user has never interacted with entitySelection or is in websites smart alert, the value is undefined
  // For example we don't want to hide the chart when we are in simple mode step 1
  const isServicesAndEndpointsSelectionValid = isEntitySelectionValid(entitySelection, false);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      getErrorMessage={isValidDependingOnMode =>
        getErrorMessage(!isValidDependingOnMode, !isServicesAndEndpointsSelectionValid)
      }
      customValidators={() => isServicesAndEndpointsSelectionValid}
      queryValidator={isApplicationAlertQueryValid}
      isTearSheet={isTearSheet}
      isMultiThresholdEnabled
    />
  );
}

function extractAlertConfigWithFormModel(alertConfigWithFormModel) {
  const {
    rule: { alertType },
    thresholds
  } = alertConfigWithFormModel.rules[0];

  const definedThresholdType =
    thresholds[WARNING_SEVERITY] !== undefined ? thresholds[WARNING_SEVERITY].type : thresholds[CRITICAL_SEVERITY].type;
  return { alertType, definedThresholdType };
}

function getErrorMessage(isQB2Error, isServicesAndEndpointsSelectionError) {
  if (isQB2Error) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
  if (isServicesAndEndpointsSelectionError) {
    return t('in-alerting:components.chart.alertingChartMessageEmptyApplicationSelection');
  }
}

ApplicationAlertingChartWithErrorMessage.propTypes = {
  viewConfig: chartViewConfigPropType.isRequired,
  alertConfigWithFormModel: PropTypes.shape({
    eventBasedAdaptiveBaseline: PropTypes.array,
    id: PropTypes.string.isRequired,
    created: PropTypes.number,
    applications: PropTypes.object.isRequired,
    rule: PropTypes.shape({
      alertType: PropTypes.string
    }),
    boundaryScope: PropTypes.string,
    threshold: PropTypes.object,
    builtIn: PropTypes.bool,
    global: PropTypes.bool,
    evaluationType: PropTypes.string.isRequired
  }).isRequired,

  /**
   * Optional applicationId, used to scope down the metric in the chart to a single application entity
   **/
  applicationId: PropTypes.string,

  /**
   * Optional serviceId, used to scope down the metric in the chart to a single service entity
   **/
  serviceId: PropTypes.string,

  // enables rendering of a persisted baseline:
  isEventsView: PropTypes.bool,
  isAlertDetailView: PropTypes.bool,
  setMetricResultPrecision: PropTypes.func,

  /**
   * Optional endpointId to scope down the metric in the chart to a single entity
   **/
  endpointId: PropTypes.string,
  isTearSheet: PropTypes.bool
};
