/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import { serviceLevelsObjectiveAlertDetailsFullyQualified } from 'in-service-levels/navigation/path';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { sloSmartAlertsEnabled } from 'in-services/featureFlags';

export default function SloSmartAlerts() {
  const { matchLocation } = useNavigation();

  if (!sloSmartAlertsEnabled) return <></>;

  if (matchLocation(serviceLevelsObjectiveAlertDetailsFullyQualified)) return <SloSmartAlertDetails />;

  return <>SLO Smart Alert List</>;
}
