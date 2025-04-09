/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { AlertConfigType, AlertURLProps } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
//@ts-expect-error TS migration
import { MoreMenuButton } from 'in-components/MoreMenu';
import { ALERTING_EDIT, ALERTING_CLONE_TRIGGER } from 'in-services/tracking/eventNames';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import ViewSelectorDialog from 'in-alerting/components/Dialog/ViewSelectorDialog';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { ADVANCED } from 'in-alerting/smart-alerts/data/constants';
import { t } from 'in-i18n';

import locals from './TearSheetActionHandlers.mless';

export function TearSheetEditActionHandler<AlertConfig extends AlertConfigType>({
  alertConfig,
  openOldDialog,
  useSmartAlertCreateUrl,
  closeMenu
}: {
  alertConfig: AlertConfig & { websiteId?: string; mobileAppId?: string };
  openOldDialog: VoidFunction;
  useSmartAlertCreateUrl: (args: AlertURLProps) => string;
  closeMenu?: () => void;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: alertConfig.id,
    alertConfigCreated: alertConfig.created,
    editMode: true,
    ...(alertConfig?.websiteId && { websiteId: alertConfig?.websiteId }),
    ...(alertConfig?.mobileAppId && { mobileAppId: alertConfig?.mobileAppId })
  });
  const { trackCta } = useSegmentTracking();

  return (
    <MoreMenuButton
      icon="lib_actions_edit"
      title={t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
      className={locals.button}
      onClick={() => {
        addActiveDialog(
          <ViewSelectorDialog
            trackCta={trackCta}
            openOldDialog={openOldDialog}
            getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
            mode={ADVANCED}
            trackType={ALERTING_EDIT}
            alertConfig={alertConfig}
          />
        );
        closeMenu?.();
      }}
    >
      {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit')}
    </MoreMenuButton>
  );
}

export function TearSheetCloneActionHandler<AlertConfig extends AlertConfigType>({
  alertConfig,
  openOldDialog,
  useSmartAlertCreateUrl,
  closeMenu
}: {
  alertConfig: AlertConfig & { websiteId?: string; mobileAppId?: string };
  openOldDialog: VoidFunction;
  useSmartAlertCreateUrl: (args: AlertURLProps) => string;
  closeMenu?: () => void;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: alertConfig.id,
    alertConfigCreated: alertConfig.created,
    duplicateMode: true,
    ...(alertConfig?.websiteId && { websiteId: alertConfig?.websiteId }),
    ...(alertConfig?.mobileAppId && { mobileAppId: alertConfig?.mobileAppId })
  });
  const { trackCta } = useSegmentTracking();

  return (
    <MoreMenuButton
      icon="lib_actions_copy"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
      className={locals.button}
      onClick={() => {
        addActiveDialog(
          <ViewSelectorDialog
            trackCta={trackCta}
            openOldDialog={openOldDialog}
            getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
            mode={ADVANCED}
            trackType={ALERTING_CLONE_TRIGGER}
            alertConfig={alertConfig}
          />
        );
        closeMenu?.();
      }}
    >
      {t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate')}
    </MoreMenuButton>
  );
}

export function ShowSelectorDialog<AlertConfig extends AlertConfigType>({
  isCopy,
  alertConfig,
  alertConfigId,
  openDialog,
  useSmartAlertCreateUrl
}: {
  isCopy: boolean;
  alertConfig: AlertConfig & { websiteId?: string; mobileAppId?: string };
  alertConfigId: string;
  openDialog: VoidFunction;
  useSmartAlertCreateUrl: (args: AlertURLProps) => string;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl({
    alertId: alertConfig.id,
    alertConfigCreated: alertConfig.created,
    ...(alertConfig?.websiteId && { websiteId: alertConfig?.websiteId }),
    ...(alertConfig?.mobileAppId && { mobileAppId: alertConfig?.mobileAppId }),
    ...(isCopy && { duplicateMode: isCopy }),
    ...(!isCopy && alertConfigId && { editMode: true })
  });
  const { trackCta } = useSegmentTracking();
  return (
    <ViewSelectorDialog
      trackCta={trackCta}
      openOldDialog={openDialog}
      getLinkToCreateSmartAlert={getLinkToCreateSmartAlert}
      mode={ADVANCED}
      trackType={isCopy ? ALERTING_CLONE_TRIGGER : alertConfigId ? ALERTING_EDIT : undefined}
      alertConfig={alertConfig}
    />
  );
}
