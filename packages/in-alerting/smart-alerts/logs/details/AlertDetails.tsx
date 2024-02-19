/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
} from 'in-alerting/smart-alerts/logs/api/logsAlertConfig';
import {
  alertsDetailsPath as alertsTabSegment,
  alertDetailsFullyQualifiedPath as detailsPath,
  alertsFullyQualifiedPath as listPath
} from 'in-logging/navigation/paths';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-logging/navigation/matrix';
import AlertConfiguration from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import LogsAlertsTabHeader from 'in-alerting/smart-alerts/logs/LogsAlertsTabHeader';
import { LogAlertConfigWithMetadata } from 'in-types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { role } from 'in-stores/user';

export default function AlertDetails() {
  const timeConfig = useTimeConfig();
  return (
    <LogsAlertsTabHeader>
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
          renderSmartAlertDialog={() => <></>}
          renderAlertConfiguration={renderAlertConfiguration}
          getAllowedPlaceholders={() => []}
          isGlobalSmartAlert
          canConfigureGlobalAlertConfigs={role?.canConfigureGlobalLogSmartAlerts}
          displayEditAction={false}
          displayDuplicateAction={false}
        />
      </LeftRightPadding>
    </LogsAlertsTabHeader>
  );
}
function renderAlertConfiguration({ alertConfig }: { alertConfig: LogAlertConfigWithMetadata }) {
  return <AlertConfiguration alertConfig={alertConfig} />;
}
