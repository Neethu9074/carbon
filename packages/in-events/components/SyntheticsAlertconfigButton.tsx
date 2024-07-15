/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { alertId as alertIdMatrixParam, testId as testIdMatrixParam } from 'in-synthetics/navigation/matrix';
import { syntheticSmartAlertsPath, alertsTabDetailsFullyQualified } from 'in-synthetics/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { SyntheticAlertConfigWithMetadata } from 'in-types';
import { t } from 'in-i18n';

interface SyntheticsAlertconfigButtonProps {
  alertConfig: SyntheticAlertConfigWithMetadata;
}

export default function SyntheticsAlertconfigButton({ alertConfig }: SyntheticsAlertconfigButtonProps) {
  const { location, createHref } = useNavigation();
  const alertConfigDetailLocation = { ...location, pathname: alertsTabDetailsFullyQualified };
  setOrDeleteMatrixKey(location, syntheticSmartAlertsPath, testIdMatrixParam, alertConfig.syntheticTestIds);
  setOrDeleteMatrixKey(location, syntheticSmartAlertsPath, alertIdMatrixParam, alertConfig.id);
  return (
    <Button kind="secondary" href={createHref(alertConfigDetailLocation)}>
      {t('in-events:buttonViewAlertConfig')}
    </Button>
  );
}
