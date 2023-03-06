/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { t } from 'in-i18n';

export default function NoTestSelected({
  height = 80, // default height of an empty row with icon
  text = t('in-alerting:smartAlerts.synthetics.selectTests.noTestSelectedText')
}) {
  return <NoItemSelected text={text} height={height} />;
}
