/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/legacy';

import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

export default function CreateSmartAlertButton({
  isGlobal,
  buttonName,
  isFloatingButton,
  isMigrate = false,
  isMenuItem = false,
  boundaryScope,
  defaultBoundaryScope,
  serviceId,
  applicationId,
  endpointId
}: {
  isGlobal: boolean;
  buttonName: string;
  isFloatingButton?: boolean;
  isMigrate?: boolean;
  isMenuItem?: boolean;
  boundaryScope?: string;
  defaultBoundaryScope?: string;
  serviceId?: string;
  applicationId?: string;
  endpointId?: string;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    migration: isMigrate,
    boundaryScope: boundaryScope || defaultBoundaryScope,
    serviceId: serviceId,
    applicationId: applicationId,
    endpointId: endpointId
  });
  return (
    <Button
      className={classNames({
        [locals.floatingButton]: isFloatingButton,
        [locals.menuItem]: isMenuItem
      })}
      icon="lib_alerts_create"
      kind={isFloatingButton ? 'primaryv2' : 'secondaryDarker'}
      href={createSmartAlertPath}
    >
      {buttonName}
    </Button>
  );
}
