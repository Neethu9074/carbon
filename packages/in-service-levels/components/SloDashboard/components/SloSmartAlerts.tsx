/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import SloSmartAlertDetails from 'in-service-levels/components/SloDashboard/components/SloSmartAlertDetails';
import { serviceLevelsObjectiveAlertDetailsFullyQualified } from 'in-service-levels/navigation/path';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import Alerts from 'in-alerting/smart-alerts/slo/Alerts';
import { Nullish } from 'in-types';

interface SloAlertsProps {
  data: SloTabData;
}
interface SloAlertsWrapperProps {
  data: SloTabData | Nullish;
}

export default function SloSmartAlerts({ data }: SloAlertsWrapperProps) {
  if (!data) {
    return null;
  }
  return <SloSmartAlertsContent data={data} />;
}

function SloSmartAlertsContent({ data }: Required<SloAlertsProps>) {
  const { matchLocation } = useNavigation();

  const { configuration } = data;

  if (matchLocation(serviceLevelsObjectiveAlertDetailsFullyQualified))
    return <SloSmartAlertDetails sloId={configuration.id!} />;

  return <Alerts sloId={configuration.id!} />;
}
