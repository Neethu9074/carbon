/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { TimeConfig, WebsiteAlertConfigWithMetadata } from '@instana/types';

import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getAllVersionsOfAlertConfig,
  getLatestAlertConfig,
  restoreAlertConfigVersion
} from 'in-alerting/smart-alerts/websites/api/websiteAlertConfig';
import {
  alertsTab as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  alertsTabListFullyQualified as listPath
} from 'in-websites/navigation/paths';
//@ts-expect-error TS migration
import AlertConfiguration from 'in-alerting/smart-alerts/websites/details/AlertConfiguration';
//@ts-expect-error TS migration
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
//@ts-expect-error TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { Nullish } from 'in-types';

const endpointConfig = { asObservable: true };

interface AlertDetailsProps {
  timeConfig: TimeConfig;
  websiteId: string;
  websiteLabel: string;
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
        created ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig) : getLatestAlertConfig(id, endpointConfig)
      }
      getConfigVersions={(id: string) => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={(props: SmartAlertDialogWrapperProps) => <SmartAlertDialogWrapper {...props} />}
      renderAlertConfiguration={({ alertConfig }: { alertConfig: WebsiteAlertConfigWithMetadata }) => (
        <AlertConfiguration alertConfig={alertConfig} />
      )}
    />
  );
}

interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: WebsiteAlertConfigWithMetadata;
  setRevision: (arg: string | Nullish) => void;
  isCopy: boolean;
  detailsPath: string;
  alertConfigId: string;
}

interface CloseProps {
  id?: string;
  created?: number;
}

function SmartAlertDialogWrapper({
  close,
  alertConfig,
  setRevision,
  isCopy,
  detailsPath,
  alertConfigId
}: SmartAlertDialogWrapperProps) {
  const { location, navigate } = useNavigation();

  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={({ id, created }: CloseProps = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          const onCloseTargetLocation = { ...location, pathname: detailsPath };
          setOrDeleteMatrixKey(onCloseTargetLocation, alertsTabSegment, alertIdParam, id ?? alertConfigId);
          setOrDeleteMatrixKey(onCloseTargetLocation, alertsTabSegment, alertCreatedParam, created); // if not set, use the latest
          navigate(onCloseTargetLocation);
        }
      }}
      editMode={!isCopy}
    />
  );
}
