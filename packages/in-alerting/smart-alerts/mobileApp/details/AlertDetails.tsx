/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/mobileApp/api/mobileAppAlertConfig';
import {
  alertsTabDetailsFullyQualified as detailsPath,
  alertsTabListFullyQualified as listPath,
  alertsTab as alertsTabSegment
} from 'in-mobile-apps/navigation/paths';
import { useSmartAlertCreateUrl as useSmartAlertTearSheetUrl } from 'in-alerting/smart-alerts/mobileApp/hooks/useSmartAlertCreateUrl';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-mobile-apps/navigation/matrix';
import { MobileAppSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
//@ts-expect-error Needs TS Migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/mobileApp/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/mobileApp/dialog/AlertConfigDialog';
import { mobileAppSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { Nullish, VersionedConfig } from 'in-types';
import { role } from 'in-stores/user';

export interface AlertDetailsProps {
  mobileAppId: string;
}

export default function AlertDetails(props: AlertDetailsProps) {
  return (
    <Alert
      {...props}
      paths={{
        detailsPath,
        listPath,
        alertsTabSegment
      }}
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id: string, created: number) =>
        created ? getAlertConfigByIdAndTimestamp(id, created) : getLatestAlertConfig(id)
      }
      getConfigVersions={(id: string) => getAllVersionsOfAlertConfig(id)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={(props: SmartAlertDialogWrapperProps) => <SmartAlertDialogWrapper {...props} />}
      renderAlertConfiguration={({ alertConfig }: { alertConfig: MobileAppSmartAlertConfigWithMetadata }) => (
        <AlertConfiguration alertConfig={alertConfig} />
      )}
      showActionButton
      canConfigureIndividualAlertConfigs={role?.canConfigureMobileAppSmartAlerts}
      getLinkToEditOrDuplicateSmartAlertTearSheet={useSmartAlertTearSheetUrl}
      displayTearSheetActions={mobileAppSmartAlertFullScreenDesignEnabled}
    />
  );
}
interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: MobileAppSmartAlertConfigWithMetadata & VersionedConfig & { duplicateFrom?: string };
  setRevision: (arg: string | Nullish) => void;
  isCopy: boolean;
}

function SmartAlertDialogWrapper({ close, alertConfig, setRevision, isCopy }: SmartAlertDialogWrapperProps) {
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={() => {
        close();
        setRevision(null);
      }}
      editMode={!isCopy}
      startWithSimpleMode={false}
    />
  );
}
