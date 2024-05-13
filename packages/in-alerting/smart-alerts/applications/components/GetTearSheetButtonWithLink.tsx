/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useSmartAlertCreateUrl as useSmartAlertEditUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
//@ts-expect-error
import { MoreMenuButton } from 'in-components/MoreMenu';

interface GetTearSheetLinkProps {
  buttonIcon: string;
  buttonName: string;
  isGlobal: boolean;
  alertId: string;
  alertConfigCreated: number;
}

export default function GetTearSheetButtonWithLink({
  buttonIcon,
  buttonName,
  isGlobal,
  alertId,
  alertConfigCreated
}: GetTearSheetLinkProps) {
  const getLinkToEditSmartAlert = useSmartAlertEditUrl();
  const editSmartAlertPath = getLinkToEditSmartAlert({
    isGlobal: isGlobal,
    alertId: alertId,
    alertConfigCreated: alertConfigCreated
  });
  return (
    <MoreMenuButton icon={buttonIcon} href={editSmartAlertPath}>
      {buttonName}
    </MoreMenuButton>
  );
}
