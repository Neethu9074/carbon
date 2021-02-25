/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useMemo } from 'react';

import AlertingChartWithErrorMessage from 'in-new-components/Alerting/Chart/AlertingChartWithErrorMessage';
import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-websites/alerting/components/AlertQueryBuilder';
import { getBlueprintConfig } from 'in-websites/alerting/data/blueprintConfig';

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
