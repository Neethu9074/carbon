/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import {
  serviceLevelsAlertsFullyQualified,
  serviceLevelsObjectiveAlertDetailsFullyQualified,
  serviceLevelsAlertDetailsSegment,
  serviceLevelsAlertDetailsFullyQualified,
  serviceLevelsObjectiveAlertsFullyQualified
} from 'in-service-levels/navigation/path';
import {
  getAllSloAlertConfigurationVersions,
  getSloAlertConfiguration,
  restoreSloAlertConfiguration
} from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
import {
  deleteAlertConfig,
  disableAlertConfig,
  enableAlertConfig
} from 'in-alerting/smart-alerts/components/api/smartAlertConfig';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { sloSmartAlertDetailsUrlParameters } from 'in-service-levels/navigation/urlParameters';
import AlertConfiguration from 'in-alerting/smart-alerts/slo/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import AlertConfigDialog from 'in-alerting/smart-alerts/slo/dialog/AlertConfigDialog';
import { baseUrl } from 'in-alerting/smart-alerts/components/api/apiEndpoints';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { Nullish } from 'in-types';

interface AlertDetailsProps {
  sloId?: string;
}
export default function AlertDetails({ sloId }: AlertDetailsProps) {
  const timeConfig = useTimeConfig();
  return (
    <LeftRightPadding>
      <Alert
        timeConfig={timeConfig}
        paths={{
          detailsPath: sloId
            ? serviceLevelsObjectiveAlertDetailsFullyQualified
            : serviceLevelsAlertDetailsFullyQualified,
          listPath: sloId ? serviceLevelsObjectiveAlertsFullyQualified : serviceLevelsAlertsFullyQualified,
          alertsTabSegment: serviceLevelsAlertDetailsSegment
        }}
        matrix={{
          alertIdParam: sloSmartAlertDetailsUrlParameters.alertId.name,
          alertCreatedParam: sloSmartAlertDetailsUrlParameters.alertCreated.name
        }}
        getConfig={getSloAlertConfiguration}
        getConfigVersions={getAllSloAlertConfigurationVersions}
        enableConfig={(id: string) => enableAlertConfig(id, baseUrl.SLO)}
        disableConfig={(id: string) => disableAlertConfig(id, baseUrl.SLO)}
        deleteConfig={(id: string) => deleteAlertConfig(id, baseUrl.SLO)}
        restoreConfig={restoreSloAlertConfiguration}
        renderSmartAlertDialog={SmartAlertDialogWrapper}
        renderAlertConfiguration={AlertConfiguration}
        getAllowedPlaceholders={() => []}
        isGlobalSmartAlert
        canConfigureGlobalAlertConfigs
      />
    </LeftRightPadding>
  );
}

interface SmartAlertDialogWrapperProps {
  close: () => void;
  alertConfig: ServiceLevelsAlertConfigWithMetadata;
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
    />
  );
}
