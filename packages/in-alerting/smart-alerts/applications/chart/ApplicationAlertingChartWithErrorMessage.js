/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Message, Spacer } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import onSubscribeBaselinePredictions from 'in-alerting/smart-alerts/applications/subscriptions/getAdaptiveBaselinePredictions';
import { getQueryBuilderForAlertType } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { chartViewConfigPropType } from 'in-alerting/components/Chart/chartViewConfig';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { baselinePreviewOnAlertPageEnabled } from 'in-services/featureFlags';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import { t, Trans } from 'in-i18n';

const NoDataPlaceHolder = ({ text }) => <NoDataAvailable text={text} height={230} />;

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const {
    alertConfigWithFormModel: { evaluationType, threshold },
    serviceId,
    endpointId,
    isAlertDetailView
  } = props;

  const usingPersistedAdaptiveBaseline = isAlertDetailView && threshold?.type === ADAPTIVE_BASELINE;

  if (usingPersistedAdaptiveBaseline && !baselinePreviewOnAlertPageEnabled) {
    // info shown as long as previews is disabled by feature flag
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noChartForAdaptiveBaseline')} />;
  }

  if (PER_AP_ENDPOINT === evaluationType && !endpointId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataWithoutEndpointSelection')} />;
  }

  if (PER_AP_SERVICE === evaluationType && !serviceId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataAvailable')} />;
  }

  if (usingPersistedAdaptiveBaseline && baselinePreviewOnAlertPageEnabled) {
    return <ApplicationAlertingChartWithErrorMessageForAdaptiveBaseline {...props} />;
  }

  return <ApplicationAlertingChartWithErrorMessageAndData {...props} />;
}

function ApplicationAlertingChartWithErrorMessageForAdaptiveBaseline(props) {
  const {
    alertConfigWithFormModel: { created, id, granularity },
    viewConfig: { timeConfig },
    applicationId,
    serviceId,
    endpointId
  } = props;

  const selectedEntityId = endpointId ?? serviceId ?? applicationId;

  const queryParams = {
    alertConfigId: id,
    alertCreated: created,
    applicationId,
    entityId: selectedEntityId, // either endpoint or service or appId if selected
    timeConfig,
    granularity
  };
  const fetchPersistedBaselineResult = useObservable(
    selectedEntityId ? onSubscribeBaselinePredictions(queryParams).startWith(pendingResult) : null,
    [id, created, applicationId, selectedEntityId, timeConfig]
  );

  const error = hasError(fetchPersistedBaselineResult);
  const adaptiveBaseline = error || isLoading(fetchPersistedBaselineResult) ? [] : fetchPersistedBaselineResult?.data;

  return (
    <>
      <ApplicationAlertingChartWithErrorMessageAndData {...props} eventBasedAdaptiveBaseline={adaptiveBaseline} />
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
function ApplicationAlertingChartWithErrorMessageAndData(props) {
  const { alertConfigWithFormModel } = props;

  const {
    rule: { alertType },
    threshold: { type: thresholdType }
  } = alertConfigWithFormModel;

  const isApplicationAlertQueryValid = useMemo(() => {
    const { isQueryValid } = getQueryBuilderForAlertType(alertType, thresholdType);
    return ([tagFilterFormModel, timeConfig]) => isQueryValid(tagFilterFormModel, timeConfig);
  }, [alertType, thresholdType]);

  const entitySelection = alertConfigWithFormModel.applications;
  // If a user deselected all entities from entitySelection we have an empty object
  // If a user has never interacted with entitySelection or is in websites smart alert, the value is undefined
  // For example we don't want to hide the chart when we are in simple mode step 1
  const isServicesAndEndpointsSelectionValid = isEntitySelectionValid(
    entitySelection,
    alertConfigWithFormModel.builtIn
  );

  return (
    <AlertingChartWithErrorMessage
      {...props}
      getErrorMessage={isValidDependingOnMode =>
        getErrorMessage(!isValidDependingOnMode, !isServicesAndEndpointsSelectionValid)
      }
      customValidators={() => isServicesAndEndpointsSelectionValid}
      queryValidator={isApplicationAlertQueryValid}
    />
  );
}

function getErrorMessage(isQB2Error, isServicesAndEndpointsSelectionError) {
  if (isQB2Error) {
    return t('in-alerting:components.chart.alertingChartMessageInvalidFilterQuery');
  }
  if (isServicesAndEndpointsSelectionError) {
    return t('in-alerting:components.chart.alertingChartMessageEntitySelectionInvalid');
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
  isAlertDetailView: PropTypes.bool,
  setMetricResultPrecision: PropTypes.func,

  /**
   * Optional endpointId to scope down the metric in the chart to a single entity
   **/
  endpointId: PropTypes.string
};
