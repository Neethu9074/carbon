/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  PER_AP_SERVICE,
  PER_AP_ENDPOINT
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { isEntitySelectionValid } from 'in-alerting/smart-alerts/applications/form/formUtils';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { t } from 'in-i18n';

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, serviceId } = props;

  if (PER_AP_ENDPOINT === alertConfigWithFormModel.evaluationType) {
    return <NoDataAvailable text={'Per Entity preview chart is not yet supported.'} />;
  }

  if (PER_AP_SERVICE === alertConfigWithFormModel.evaluationType && !serviceId) {
    return <NoDataAvailable text={t('in-alerting:smartAlerts.applications.chart.noDataAvailable')} height={230} />;
  }

  const entitySelection = alertConfigWithFormModel?.applications;
  // If a user deselected all entities from entitySelection we have an empty object
  // If a user has never interacted with entitySelection or is in websites smart alert, the value is undefined
  // For example we don't want to hide the chart when we are in simple mode step 1
  const isServicesAndEndpointsSelectionValid = isEntitySelectionValid(entitySelection);

  return (
    <AlertingChartWithErrorMessage
      {...props}
      subEntityId={serviceId}
      getErrorMessage={isValidDependingOnMode =>
        getErrorMessage(!isValidDependingOnMode, !isServicesAndEndpointsSelectionValid)
      }
      customValidators={() => isServicesAndEndpointsSelectionValid}
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
