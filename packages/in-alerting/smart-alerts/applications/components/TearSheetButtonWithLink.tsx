/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useSmartAlertCreateUrl as useSmartAlertEditUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { ALERTING_EDIT, ALERTING_CLONE_TRIGGER } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
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
  alertConfig?: AlertConfigType;
}

export default function TearSheetButtonWithLink({
  buttonIcon,
  buttonName,
  isGlobal,
  alertId,
  alertConfigCreated,
  duplicateMode,
  editMode,
  alertConfig
}: TearSheetLinkProps) {
  const getLinkToEditSmartAlert = useSmartAlertEditUrl();
  const editSmartAlertPath = getLinkToEditSmartAlert({
    isGlobal: isGlobal,
    alertId: alertId,
    alertConfigCreated: alertConfigCreated,
    duplicateMode: duplicateMode,
    editMode: editMode
  });
  const { trackCta } = useSegmentTracking();
  return (
    <MoreMenuButton
      icon={buttonIcon}
      href={editSmartAlertPath}
      requireTitle
      title={buttonName}
      role="button"
      className={locals.button}
      onClick={() => {
        if (editMode) {
          trackCta(ALERTING_EDIT, { ...alertConfig });
        } else {
          trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfig });
        }
      }}
    >
      {buttonName}
    </MoreMenuButton>
  );
}
