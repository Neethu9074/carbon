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
} from 'in-alerting/smart-alerts/infrastructure/api/infrastructureAlertConfig';
// eslint-disable-next-line no-restricted-imports
import {
  infraAlertsDetailsPath as alertsTabSegment,
  infraAlertDetailsFullyQualifiedPath as detailsPath,
  infraSmartAlerts as listPath
} from 'in-stores/navigation/paths/mainPaths';
// eslint-disable-next-line no-restricted-imports
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-infrastructure/navigation/matrix';
import { useSmartAlertCreateUrl as useSmartAlertTearSheetUrl } from 'in-alerting/smart-alerts/infrastructure/hooks/useSmartAlertCreateUrl';
import { InfraSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/infrastructure/form/infraAlertConfigTypes';
import { infraSmartAlertFullScreenDesignEnabled, infraSmartAlertDialogViewEnabled } from 'in-services/featureFlags';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import AlertConfigDialog from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AlertConfigDialog';
import { getAllowedPlaceholders } from 'in-alerting/smart-alerts/components/utils/titlePlaceholders';
import AlertConfiguration from 'in-alerting/smart-alerts/infrastructure/details/AlertConfiguration';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { getSmartAlertDisplayMode } from 'in-alerting/smart-alerts/utils/smartAlertViewUtils';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';
import { Nullish } from 'in-types';

const alertDisplayMode = getSmartAlertDisplayMode(
  infraSmartAlertDialogViewEnabled,
  infraSmartAlertFullScreenDesignEnabled
);

export default function AlertDetails() {
  const timeConfig = useTimeConfig();
  return (
    <LeftRightPadding>
      <Alert
        timeConfig={timeConfig}
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
        renderAlertConfiguration={({ alertConfig }: { alertConfig: InfraSmartAlertConfigWithMetadata }) => (
          <AlertConfiguration alertConfig={alertConfig} />
        )}
        getAllowedPlaceholders={getAllowedPlaceholders}
        getLinkToEditOrDuplicateSmartAlertTearSheet={useSmartAlertTearSheetUrl}
        canConfigureGlobalAlertConfigs={role?.canConfigureGlobalInfraSmartAlerts && !role?.limitedInfrastructureScope}
        alertDisplayMode={alertDisplayMode}
        hideAlertIcon
        isGlobalSmartAlert
      />
    </LeftRightPadding>
  );
}

interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: InfraSmartAlertConfigWithMetadata;
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
