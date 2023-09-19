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
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import AlertConfiguration from 'in-alerting/smart-alerts/infrastructure/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { InfraAlertConfigWithMetadata } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';

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
        renderAlertConfiguration={({ alertConfig }: { alertConfig: InfraAlertConfigWithMetadata }) => (
          <AlertConfiguration alertConfig={alertConfig} />
        )}
        getAllowedPlaceholders={() => []}
        displayEditAction={false}
        displayDuplicateAction={false}
      />
    </LeftRightPadding>
  );
}

interface SmartAlertDialogWrapperProps {
  alertConfig: InfraAlertConfigWithMetadata;
}

//@ts-expect-error can be removed later when smart alert dialog is available
function SmartAlertDialogWrapper({ alertConfig }: SmartAlertDialogWrapperProps) {
  return <></>;
}
