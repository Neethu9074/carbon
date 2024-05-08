/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import { SloUrlState, sloSmartAlertsUrlParameters } from 'in-service-levels/navigation/urlParameters';
import { sloSmartAlertsEnabled } from 'in-services/featureFlags';
import useUrlState from 'in-hooks/useUrlState';

export default function SloSmartAlerts() {
  const [{ alertId }] = useUrlState<SloUrlState>({
    bind: [sloSmartAlertsUrlParameters.alertId]
  });

  if (!sloSmartAlertsEnabled) return <></>;

  if (alertId) return <SloSmartAlertDetails />;

  return <>SLO Smart Alert List</>;
}
