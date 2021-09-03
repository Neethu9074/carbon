/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { isAlertQueryValid as isApplicationAlertQueryValid } from 'in-alerting/smart-alerts/applications/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import { ADAPTIVE_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { t } from 'in-i18n';

const NoDataPlaceHolder = ({ text }) => <NoDataAvailable text={text} height={230} />;

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, serviceId, endpointId, isAlertDetailView } = props;

  const isAdaptiveBaseline = alertConfigWithFormModel.threshold?.type === ADAPTIVE_BASELINE;
  if (isAdaptiveBaseline && isAlertDetailView) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noChartForAdaptiveBaseline')} />;
  }
  if (PER_AP_ENDPOINT === alertConfigWithFormModel.evaluationType && !endpointId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataWithoutEndpointSelection')} />;
  }

  if (PER_AP_SERVICE === alertConfigWithFormModel.evaluationType && !serviceId) {
    return <NoDataPlaceHolder text={t('in-alerting:smartAlerts.applications.chart.noDataAvailable')} />;
  }

  const entitySelection = alertConfigWithFormModel?.applications;
  // If a user deselected all entities from entitySelection we have an empty object
  // If a user has never interacted with entitySelection or is in websites smart alert, the value is undefined
  // For example we don't want to hide the chart when we are in simple mode step 1
  const isServicesAndEndpointsSelectionValid = isEntitySelectionValid(entitySelection);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      serviceId={serviceId}
      endpointId={endpointId}
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
  alertConfigWithFormModel: PropTypes.shape({
    applications: PropTypes.object.isRequired,
    threshold: PropTypes.object,
    evaluationType: PropTypes.string.isRequired
  }).isRequired,
  useApproximateQueryPrecisionForMetrics: PropTypes.bool,

  /**
   * Optional serviceId, used
   * to scope down the metric in the chart to a single application config
   **/
  serviceId: PropTypes.string,
  isAlertDetailView: PropTypes.bool,

  /**
   * Optional endpointId
   * to scope down the metric in the chart to a single entity
   **/
  endpointId: PropTypes.string
};
