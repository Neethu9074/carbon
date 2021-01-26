/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';

export default function ApplicationAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel, serviceId } = props;

  if ('PER_AP_SERVICE' === alertConfigWithFormModel.evaluationType && !serviceId) {
    // TODO Show loading indicator or message placeholder as soon as it's decided what we wanna show
    //      when no sub-entity is selected.
    return null;
  }

  return <AlertingChartWithErrorMessage {...props} subEntityId={serviceId} />;
}
