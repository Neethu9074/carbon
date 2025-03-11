/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  WebsiteSmartAlertConfigWithMetadata,
  MobileAppSmartAlertConfigWithMetadata
} from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { useSmartAlertCreateUrl as useMobileAppSmartAlertCreateUrl } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import { useSmartAlertCreateUrl as useWebsiteSmartAlertCreateUrl } from 'in-alerting/smart-alerts/websites/hooks/useSmartAlertCreateUrl';
//@ts-expect-error TS migration
import { getTrackingAlertConfig } from 'in-alerting/smart-alerts/utils/segmentUtils';
//@ts-expect-error TS migration
import { MoreMenuButton } from 'in-components/MoreMenu';
import { ALERTING_EDIT, ALERTING_CLONE_TRIGGER } from 'in-services/tracking/eventNames';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { FULLSCREEN } from 'in-alerting/smart-alerts/data/constants';
import { t } from 'in-i18n';

import locals from './TearSheetActionHandlers.mless';

export function TearSheetEditActionHandler({
  id,
  created,
  eumId,
  eumType,
  alertConfig
}: {
  id: string;
  created: number;
  eumId: string;
  eumType: string;
  alertConfig: WebsiteSmartAlertConfigWithMetadata | MobileAppSmartAlertConfigWithMetadata;
}) {
  const getWebsiteLinkToCreateSmartAlert = useWebsiteSmartAlertCreateUrl({
    websiteId: eumId,
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });

  const getMobileAppLinkToCreateSmartAlert = useMobileAppSmartAlertCreateUrl({
    mobileAppId: eumId,
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });
  const alertConfigForTracking = getTrackingAlertConfig(alertConfig, undefined);
  const { trackCta } = useSegmentTracking();

  return (
    <MoreMenuButton
      icon="lib_actions_edit"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
      href={eumType === websiteEum ? getWebsiteLinkToCreateSmartAlert : getMobileAppLinkToCreateSmartAlert}
      className={locals.button}
      onClick={() => {
        trackCta(ALERTING_EDIT, { ...alertConfigForTracking, dialogMode: FULLSCREEN });
      }}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonEdit'))}
    </MoreMenuButton>
  );
}

export function TearSheetCloneActionHandler({
  id,
  created,
  eumId,
  eumType,
  alertConfig
}: {
  id: string;
  created: number;
  eumId: string;
  eumType: string;
  alertConfig: WebsiteSmartAlertConfigWithMetadata | MobileAppSmartAlertConfigWithMetadata;
}) {
  const getWebsiteLinkToCreateSmartAlert = useWebsiteSmartAlertCreateUrl({
    websiteId: eumId,
    alertId: id,
    alertConfigCreated: created,
    duplicateMode: true
  });
  const alertConfigForTracking = getTrackingAlertConfig(alertConfig, undefined);
  const { trackCta } = useSegmentTracking();

  const getMobileAppLinkToCreateSmartAlert = useMobileAppSmartAlertCreateUrl({
    mobileAppId: eumId,
    alertId: id,
    alertConfigCreated: created,
    editMode: true
  });

  return (
    <MoreMenuButton
      icon="lib_actions_copy"
      title={getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
      href={eumType === websiteEum ? getWebsiteLinkToCreateSmartAlert : getMobileAppLinkToCreateSmartAlert}
      className={locals.button}
      onClick={() => {
        trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfigForTracking, dialogMode: FULLSCREEN });
      }}
    >
      {getButtonName(t('in-alerting:smartAlerts.applications.inventory.labelActionButtonDuplicate'))}
    </MoreMenuButton>
  );
}
