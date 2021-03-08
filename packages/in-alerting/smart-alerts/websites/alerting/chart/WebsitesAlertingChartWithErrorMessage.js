/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/alerting/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/alerting/data/blueprintConfig';

export default function WebsitesAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel } = props;
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const websiteId = alertConfigWithFormModel.websiteId;
  const beaconType = blueprintConfig.getBeaconType(alertConfigWithFormModel.rule.metricName);
  const { isQueryValid } = useMemo(() => createBoundedAlertQueryBuilder(websiteId, beaconType), [
    websiteId,
    beaconType
  ]);

  return <AlertingChartWithErrorMessage isAlertQueryValid={createIsAlertQueryValid(isQueryValid)} {...props} />;
}
