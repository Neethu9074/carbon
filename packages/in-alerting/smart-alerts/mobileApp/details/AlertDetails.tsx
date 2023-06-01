/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { MobileAppAlertConfigWithMetadata } from '@instana/types';

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
//@ts-expect-error Needs TS Migration
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-mobile-apps/navigation/matrix';
//@ts-expect-error Needs TS Migration
import AlertConfiguration from 'in-alerting/smart-alerts/mobileApp/details/AlertConfiguration';
//@ts-expect-error Needs TS Migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';

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
      renderSmartAlertDialog={() => {}}
      renderAlertConfiguration={({ alertConfig }: { alertConfig: MobileAppAlertConfigWithMetadata }) => (
        <AlertConfiguration alertConfig={alertConfig} />
      )}
      showActionButton={false}
    />
  );
}
