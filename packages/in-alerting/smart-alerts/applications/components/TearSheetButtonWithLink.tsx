/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useSmartAlertCreateUrl as useSmartAlertEditUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
//@ts-expect-error
import { MoreMenuButton } from 'in-components/MoreMenu';

import locals from './TearSheetButtonWithLink.mless';

interface TearSheetLinkProps {
  buttonIcon: string;
  buttonName: string;
  isGlobal: boolean;
  alertId: string;
  alertConfigCreated: number;
  duplicateMode?: string;
  editMode?: string;
}

export default function TearSheetButtonWithLink({
  buttonIcon,
  buttonName,
  isGlobal,
  alertId,
  alertConfigCreated,
  duplicateMode,
  editMode
}: TearSheetLinkProps) {
  const getLinkToEditSmartAlert = useSmartAlertEditUrl();
  const editSmartAlertPath = getLinkToEditSmartAlert({
    isGlobal: isGlobal,
    alertId: alertId,
    alertConfigCreated: alertConfigCreated,
    duplicateMode: duplicateMode,
    editMode: editMode
  });
  return (
    <MoreMenuButton
      icon={buttonIcon}
      href={editSmartAlertPath}
      requireTitle
      title={buttonName}
      role="button"
      className={locals.button}
    >
      {buttonName}
    </MoreMenuButton>
  );
}
