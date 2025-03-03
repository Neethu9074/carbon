/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SyntheticAlertConfig, SyntheticAlertConfigWithMetadata, TimeConfig, VersionedConfig } from '@instana/types';

import {
  syntheticSmartAlertsPath as alertsTabSegment,
  alertsTabDetailsFullyQualified as detailsPath,
  syntheticSmartAlertsPath as listPath,
  dashboardTestAlertsTabDetailsFullyQualified as dashboardTestAlertDetailsPath,
  dashboardAlertsFullyQualified as dashboardAlertPath,
  alertsTab as dashboardTestAlertTabSegment
} from 'in-synthetics/navigation/paths';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig,
  getAlertConfigByIdAndTimestamp,
  getLatestAlertConfig,
  restoreAlertConfigVersion,
  getAllVersionsOfAlertConfig
} from 'in-alerting/smart-alerts/synthetics/api/syntheticAlertConfig';
import { useSmartAlertCreateUrl as useSmartAlertTearSheetUrl } from 'in-alerting/smart-alerts/synthetics/hooks/useSmartAlertCreateUrl';
import { alertCreated as alertCreatedParam, alertId as alertIdParam } from 'in-synthetics/navigation/matrix';
import { allowedPlaceholders } from 'in-alerting/smart-alerts/synthetics/dialog/advanced/titlePlaceholders';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import AlertConfiguration from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import AlertConfigDialog from 'in-alerting/smart-alerts/synthetics/dialog/AlertConfigDialog';
import { syntheticSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { TestResponse } from 'in-synthetics/utils/constants';
import { Location } from 'in-stores/navigation/types';
import { role } from 'in-stores/user';
import { Nullish } from 'in-types';

const endpointConfig: { asObservable: true } = { asObservable: true };

export interface AlertDetailsProps {
  testId: string;
  test: TestResponse;
  location: Location;
  timeConfig: TimeConfig;
  isMainPage: boolean;
}

export default function AlertDetails(props: AlertDetailsProps) {
  const { isMainPage, testId } = props;
  return (
    <Alert
      {...props}
      paths={
        isMainPage
          ? {
              detailsPath: detailsPath,
              listPath: listPath,
              alertsTabSegment: alertsTabSegment
            }
          : {
              detailsPath: dashboardTestAlertDetailsPath,
              listPath: dashboardAlertPath,
              alertsTabSegment: dashboardTestAlertTabSegment
            }
      }
      matrix={{ alertIdParam, alertCreatedParam }}
      getConfig={(id: string, created: number) =>
        created ? getAlertConfigByIdAndTimestamp(id, created, endpointConfig) : getLatestAlertConfig(id, endpointConfig)
      }
      getConfigVersions={(id: string) => getAllVersionsOfAlertConfig(id, endpointConfig)}
      enableConfig={enableAlertConfig}
      disableConfig={disableAlertConfig}
      deleteConfig={deleteAlertConfig}
      restoreConfig={restoreAlertConfigVersion}
      renderSmartAlertDialog={(props: SmartAlertDialogWrapperProps) => (
        <SmartAlertDialogWrapper {...props} isMainPage={isMainPage} testId={testId} />
      )}
      renderAlertConfiguration={({ alertConfig }: { alertConfig: SyntheticAlertConfigWithMetadata }) => (
        <AlertConfiguration alertConfig={alertConfig} />
      )}
      getAllowedPlaceholders={() => allowedPlaceholders}
      getLinkToEditOrDuplicateSmartAlertTearSheet={useSmartAlertTearSheetUrl}
      displayTearSheetActions={syntheticSmartAlertFullScreenDesignEnabled}
      isGlobalSmartAlert
      canConfigureGlobalAlertConfigs={role?.canConfigureGlobalSyntheticSmartAlerts}
    />
  );
}

interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: SyntheticAlertConfig & VersionedConfig & { duplicateFrom?: string };
  setRevision: (arg: string | Nullish) => void;
  isCopy: boolean;
  detailsPath: string;
  alertConfigId: string;
  testId: string;
  isMainPage: boolean;
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
  alertConfigId,
  testId,
  isMainPage
}: SmartAlertDialogWrapperProps) {
  const { location, navigate } = useNavigation();
  const alertTabPath = isMainPage ? alertsTabSegment : dashboardTestAlertTabSegment;
  return (
    <AlertConfigDialog
      alertConfig={isCopy ? duplicateAlertConfig(alertConfig) : alertConfig}
      onClose={({ id, created }: CloseProps = {}) => {
        close();
        setRevision(null);
        if (isCopy) {
          const onCloseTargetLocation = { ...location, pathname: detailsPath };
          setOrDeleteMatrixKey(onCloseTargetLocation, alertTabPath, alertIdParam, id ?? alertConfigId);
          if (created) {
            setOrDeleteMatrixKey(onCloseTargetLocation, alertTabPath, alertCreatedParam, created);
          }

          navigate(onCloseTargetLocation);
        }
      }}
      editMode={!isCopy}
      testId={testId}
      startWithSimpleMode={false}
    />
  );
}
