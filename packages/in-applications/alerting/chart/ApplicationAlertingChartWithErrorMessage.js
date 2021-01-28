/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import { PER_AP_SERVICE } from 'in-applications/alerting/advanced/EvaluationSwitch/alertEvaluationTypes';
import { smartAlertsEntityGroupingEnabled } from 'in-services/featureFlags';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, serviceId } = props;

  if (PER_AP_SERVICE === alertConfigWithFormModel.evaluationType && !serviceId) {
    if (smartAlertsEntityGroupingEnabled) {
      return <NoDataAvailable text={'Please select a service to see the preview'} height={230} />;
    }
    return null;
  }

  return <AlertingChartWithErrorMessage {...props} subEntityId={serviceId} />;
}
