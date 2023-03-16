/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import generateAlertConfig from 'in-alerting/smart-alerts/synthetics/data/generateAlertConfig';

export default { component: AlertConfiguration };
const alertConfig = generateAlertConfig();

export const SytheticsConfiguration = () => {
  //@ts-expect-error - Fix in other PR
  return <AlertConfiguration alertConfig={alertConfig} />;
};
