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

  const { threshold, rule, websiteId } = alertConfigWithFormModel;
  const { metricName } = rule;
  const beaconType = blueprintConfig.getBeaconType(metricName);

  const isWebsiteAlertQueryValid = useMemo(() => {
    const { isQueryValid } = createBoundedAlertQueryBuilder(websiteId, beaconType, threshold?.type);

    return createIsAlertQueryValid(isQueryValid);
  }, [websiteId, beaconType, threshold.type]);

  return <AlertingChartWithErrorMessage queryValidator={isWebsiteAlertQueryValid} {...props} />;
}
