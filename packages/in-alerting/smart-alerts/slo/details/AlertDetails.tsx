/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelsAlertConfigWithMetadata } from '@instana/types';

import {
  serviceLevelsObjectiveAlertDetailsFullyQualified,
  serviceLevelsObjectiveAlertDetailsSegment,
  serviceLevelsObjectiveAlertsFullyQualified
} from 'in-service-levels/navigation/path';
import {
  getAllSloAlertConfigurationVersions,
  getSloAlertConfiguration
} from 'in-alerting/smart-alerts/slo/api/sloAlertConfig';
//@ts-expect-error need TS migration
import Alert from 'in-alerting/smart-alerts/components/details/Alert';
import { duplicateAlertConfig } from 'in-alerting/smart-alerts/components/dialog/sharedFunctions';
import { sloSmartAlertDetailsUrlParameters } from 'in-service-levels/navigation/urlParameters';
import AlertConfiguration from 'in-alerting/smart-alerts/slo/details/AlertConfiguration';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import AlertConfigDialog from 'in-alerting/smart-alerts/slo/dialog/AlertConfigDialog';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/fixedObjects';
import { Nullish } from 'in-types';

export default function AlertDetails() {
  const timeConfig = useTimeConfig();
  return (
    <LeftRightPadding>
      <Alert
        timeConfig={timeConfig}
        paths={{
          detailsPath: serviceLevelsObjectiveAlertDetailsFullyQualified,
          listPath: serviceLevelsObjectiveAlertsFullyQualified,
          alertsTabSegment: serviceLevelsObjectiveAlertDetailsSegment
        }}
        matrix={{
          alertIdParam: sloSmartAlertDetailsUrlParameters.alertId.name,
          alertCreatedParam: sloSmartAlertDetailsUrlParameters.alertCreated.name
        }}
        getConfig={getSloAlertConfiguration}
        getConfigVersions={getAllSloAlertConfigurationVersions}
        enableConfig={noop}
        disableConfig={noop}
        deleteConfig={noop}
        restoreConfig={noop}
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
