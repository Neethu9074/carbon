/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import {
  alertsDetailsPath as alertsTabSegment,
  alertDetailsFullyQualifiedPath as detailsPagePath,
  dashboardAlertDetailsFullPath as dashboardAlertsdetailsPath,
  dashboardSmartAlertsPath as dashboardAlertsListPath,
  alertsFullyQualifiedPath as alertListPath
} from 'in-logging/navigation/paths';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import { CreateLogsSmartAlertFloatingButton } from 'in-logging/navigation/createLogsSmartAlertFloatingButton';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfigDialog from 'in-alerting/smart-alerts/logs/dialog/advanced/AlertConfigDialog';
import AlertConfiguration from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LogsAlertsTabHeader from 'in-alerting/smart-alerts/logs/LogsAlertsTabHeader';
import LoggingDashboardWrapper from 'in-logging/dashboard/LoggingDashboardWrapper';
import { LogAlertConfigWithMetadata, Nullish } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';

interface AlertDetailsProps {
  isLogsDashboardHeader?: boolean;
}

export default function AlertDetails({ isLogsDashboardHeader = false }: AlertDetailsProps) {
  const timeConfig = useTimeConfig();
  const Header = isLogsDashboardHeader ? LoggingDashboardWrapper : LogsAlertsTabHeader;
  const listPath = isLogsDashboardHeader ? dashboardAlertsListPath : alertListPath;
  const detailsPath = isLogsDashboardHeader ? dashboardAlertsdetailsPath : detailsPagePath;
  return (
    <>
      <Header>
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
            renderAlertConfiguration={renderAlertConfiguration}
            getAllowedPlaceholders={() => []}
            isGlobalSmartAlert
            canConfigureGlobalAlertConfigs={role?.canConfigureGlobalLogSmartAlerts}
          />
        </LeftRightPadding>
      </Header>
      <CreateLogsSmartAlertFloatingButton />
    </>
  );
}
function renderAlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  return <AlertConfiguration alertConfig={alertConfig} />;
}

interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: LogAlertConfigWithMetadata;
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
