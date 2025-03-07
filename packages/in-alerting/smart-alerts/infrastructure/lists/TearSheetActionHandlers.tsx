/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/infrastructure/hooks/useSmartAlertCreateUrl';
//@ts-expect-error TS migration
import { MoreMenuButton } from 'in-components/MoreMenu';
import { ALERTING_EDIT, ALERTING_CLONE_TRIGGER } from 'in-services/tracking/eventNames';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { FULLSCREEN } from 'in-alerting/smart-alerts/data/constants';
import { t } from 'in-i18n';

import locals from './TearSheetActionHandlers.mless';

export function TearSheetEditActionHandler({
  id,
  created,
  alertConfig
}: {
  id: string;
  created: number;
  alertConfig: InfraSmartAlertConfigWithMetadata;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });
  const { trackCta } = useSegmentTracking();

  return (
    <MoreMenuButton
      icon="lib_actions_edit"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
      onClick={() => {
        trackCta(ALERTING_EDIT, { ...alertConfig, dialogMode: FULLSCREEN });
      }}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
    </MoreMenuButton>
  );
}

export function TearSheetCloneActionHandler({
  id,
  created,
  alertConfig
}: {
  id: string;
  created: number;
  alertConfig: InfraSmartAlertConfigWithMetadata;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: id,
    alertConfigCreated: created,
    duplicateMode: true
  });
  const { trackCta } = useSegmentTracking();

  return (
    <MoreMenuButton
      icon="lib_actions_copy"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
      href={getLinkToCreateSmartAlert}
      className={locals.button}
      onClick={() => {
        trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfig, dialogMode: FULLSCREEN });
      }}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
    </MoreMenuButton>
  );
}
