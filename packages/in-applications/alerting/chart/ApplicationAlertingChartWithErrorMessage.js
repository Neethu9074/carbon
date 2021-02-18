/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import { PER_AP_SERVICE } from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import { isEntitySelectionValid } from 'in-applications/alerting/form/formUtils';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { t } from 'in-i18n';

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, serviceId } = props;

  if (PER_AP_SERVICE === alertConfigWithFormModel.evaluationType && !serviceId) {
    return <NoDataAvailable text={t('in-applications:alert.chart.noDataAvailable')} height={230} />;
  }

  const entitySelection = alertConfigWithFormModel?.applications;
  // If a user deselected all entities from entitySelection we have an empty object
  // If a user has never interacted with entitySelection or is in websites smart alert, the value is undefined
  // For example we don't want to hide the chart when we are in simple mode step 1
  const isServicesAndEndpointsSelectionValid = entitySelection == null || isEntitySelectionValid(entitySelection);

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
    return t('in-new-components:alerting.chart.alertingChartMessageInvalidFilterQuery');
  }
  if (isServicesAndEndpointsSelectionError) {
    return t('in-new-components:alerting.chart.alertingChartMessageEntitySelectionInvalid');
  }
}
