/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/legacy';
import classNames from 'classnames';

import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

export default function CreateSmartAlertButton({
  isGlobal,
  buttonName,
  isFloatingButton,
  isMigrate = false
}: {
  isGlobal: boolean;
  buttonName: string;
  isFloatingButton?: boolean;
  isMigrate?: boolean;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();
  const createSmartAlertPath = getLinkToCreateSmartAlert({ isGlobal: isGlobal, migration: isMigrate });
  return (
    <Button
      className={classNames({
        [locals.floatingButton]: isFloatingButton
      })}
      icon="lib_alerts_create"
      kind={isFloatingButton ? 'primaryv2' : 'secondaryDarker'}
      href={createSmartAlertPath}
    >
      {buttonName}
    </Button>
  );
}
