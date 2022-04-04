/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import AlertingChartWithErrorMessage from 'in-alerting/components/Chart/AlertingChartWithErrorMessage';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';

export default function WebsitesAlertingChartWithErrorMessage(props) {
  const { alertConfigWithFormModel } = props;
  const blueprintConfig = getBlueprintConfig(alertConfigWithFormModel.rule.alertType);

  const websiteId = alertConfigWithFormModel.websiteId;
  const beaconType = blueprintConfig.getBeaconType(alertConfigWithFormModel.rule.metricName);

  const isWebsiteAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(websiteId, beaconType);

    return createIsAlertQueryValid(isQueryValid);
  }, [websiteId, beaconType]);

  return <AlertingChartWithErrorMessage queryValidator={isWebsiteAlertQueryValid} {...props} />;
}
