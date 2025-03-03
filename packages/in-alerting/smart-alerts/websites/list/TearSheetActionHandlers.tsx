/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/websites/hooks/useSmartAlertCreateUrl';
//@ts-expect-error TS migration
import { MoreMenuButton } from 'in-components/MoreMenu';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { t } from 'in-i18n';

import locals from './TearSheetActionHandlers.mless';

export function TearSheetEditActionHandler({
  id,
  created,
  websiteId
}: {
  id: string;
  created: number;
  websiteId: string;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    websiteId: websiteId,
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });

  return (
    <MoreMenuButton
      icon="lib_actions_edit"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
    </MoreMenuButton>
  );
}

export function TearSheetCloneActionHandler({
  id,
  created,
  websiteId
}: {
  id: string;
  created: number;
  websiteId: string;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    websiteId: websiteId,
    alertId: id,
    alertConfigCreated: created,
    duplicateMode: true
  });

  return (
    <MoreMenuButton
      icon="lib_actions_copy"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
    </MoreMenuButton>
  );
}
