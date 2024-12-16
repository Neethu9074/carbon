/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// eslint-disable-next-line no-restricted-imports
import AlertDetails from 'in-alerting/smart-alerts/slo/details/AlertDetails';

interface SloSmartAlertDetailsProps {
  sloId?: string;
}
export default function SloSmartAlertDetails({ sloId }: SloSmartAlertDetailsProps) {
  return <AlertDetails sloId={sloId} />;
}
