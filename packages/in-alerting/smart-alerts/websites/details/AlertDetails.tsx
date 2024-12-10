/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { TimeConfig, VersionedConfig } from '@instana/types';

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
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-websites/navigation/matrix';
//@ts-expect-error TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import AlertConfigDialog from 'in-alerting/smart-alerts/websites/dialog/AlertConfigDialog';
import { role } from 'in-stores/user';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

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
      renderAlertConfiguration={({ alertConfig }: { alertConfig: WebsiteSmartAlertConfigWithMetadata }) => (
        <AlertConfiguration alertConfig={alertConfig} />
      )}
      canConfigureIndividualAlertConfigs={role?.canConfigureWebsiteSmartAlerts}
    />
  );
}
export type DuplicateWebsiteAlertConfig = WebsiteSmartAlertConfigWithMetadata & {
  duplicateFrom?: string | undefined;
};
interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: DuplicateWebsiteAlertConfig;
  setRevision: (arg: string | Nullish) => void;
  isCopy: boolean;
}

function SmartAlertDialogWrapper({ close, alertConfig, setRevision, isCopy }: SmartAlertDialogWrapperProps) {
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? (duplicateAlertConfig(alertConfig) as DuplicateWebsiteAlertConfig) : alertConfig}
      onClose={() => {
        close();
        setRevision(null);
      }}
      editMode={!isCopy}
    />
  );
}

export function duplicateAlertConfig<
  T extends VersionedConfig & {
    name: string;
  }
>({ ...config }: T) {
  const { id, ...withoutId } = config;

  return {
    ...withoutId,
    duplicateFrom: id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name })
  };
}
