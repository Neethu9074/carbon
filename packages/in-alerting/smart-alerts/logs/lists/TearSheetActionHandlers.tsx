/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/logs/hooks/useSmartAlertCreateUrl';
//@ts-expect-error TS migration
import { MoreMenuButton } from 'in-components/MoreMenu';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { t } from 'in-i18n';

import locals from './TearSheetActionHandlers.mless';

export function TearSheetEditActionHandler({ id, created }: { id: string; created: number }) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });

  return (
    <MoreMenuButton
      icon="lib_actions_edit"
      title={getButtonName(t('in-alerting:smartAlerts.logs.tearSheet.labelActionButtonEdit'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
    >
      {getButtonName(t('in-alerting:smartAlerts.logs.tearSheet.labelActionButtonEdit'))}
    </MoreMenuButton>
  );
}

export function TearSheetCloneActionHandler({ id, created }: { id: string; created: number }) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: id,
    alertConfigCreated: created,
    duplicateMode: true
  });

  return (
    <MoreMenuButton
      icon="lib_actions_copy"
      title={getButtonName(t('in-alerting:smartAlerts.logs.tearSheet.labelActionButtonDuplicate'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
    >
      {getButtonName(t('in-alerting:smartAlerts.logs.tearSheet.labelActionButtonDuplicate'))}
    </MoreMenuButton>
  );
}
