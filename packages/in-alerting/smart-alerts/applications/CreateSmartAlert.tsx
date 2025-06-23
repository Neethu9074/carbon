/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';

//@ts-expect-error
import { generateAlertConfig as generateGlobalAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
//@ts-expect-error need migration
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { CarbonTableCreateButton } from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { Location } from 'in-stores/navigation/types';
import { t } from 'in-i18n';

interface CreateSmartAlertProps extends Partial<GenerateAlertConfigProps> {
  location: Location;
  defaultBoundaryScope?: string;
}
interface GenerateAlertConfigProps {
  applicationId: string;
  serviceId?: string;
  endpointId?: string;
  boundaryScope?: string;
  includeSynthetic?: boolean;
  renderAsFloatingButton?: boolean;
}

export default function CreateSmartAlert({
  applicationId,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  serviceId,
  endpointId,
  location
}: CreateSmartAlertProps) {
  const createSmartAlertPath = useGetSmartAlertPath({
    isGlobal: false,
    boundaryScope: urlBoundaryScope,
    defaultBoundaryScope: defaultBoundaryScope,
    applicationId: applicationId,
    serviceId: serviceId,
    endpointId: endpointId
  });

  if (!applicationId || !createSmartAlertPath) {
    return null;
  }

  const openOldDialog = () => {
    addActiveDialog(
      <AlertConfigDialog
        alertConfig={generateAlertConfig({
          boundaryScope: urlBoundaryScope || defaultBoundaryScope,
          applicationId,
          serviceId,
          endpointId,
          includeSynthetic
        })}
        onClose={() => {
          close();

          if (location.pathname.includes(alertsTabListFullyQualified)) {
            refreshSmartAlertConfigsList();
          }
        }}
        startWithSimpleMode
      />
    );
  };

  return (
    <FloatingActionButtons>
      <CarbonTableCreateButton
        openOldDialog={openOldDialog}
        createSmartAlertPath={createSmartAlertPath}
        buttonName={t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
        isGlobal={false}
        renderAsSimpleButton
      />
    </FloatingActionButtons>
  );
}

export function useGetSmartAlertPath({
  isGlobal,
  isMigrate = false,
  boundaryScope,
  defaultBoundaryScope,
  serviceId,
  applicationId,
  endpointId,
  eventSpecificationId
}: {
  isGlobal: boolean;
  isMigrate?: boolean;
  boundaryScope?: string;
  defaultBoundaryScope?: string;
  serviceId?: string;
  applicationId?: string;
  endpointId?: string;
  eventSpecificationId?: string;
  renderAsSimpleButton?: boolean;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();

  if (!applicationId) {
    return null;
  }
  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    migration: isMigrate,
    boundaryScope: boundaryScope || defaultBoundaryScope,
    serviceId: serviceId,
    applicationId: applicationId,
    endpointId: endpointId,
    eventSpecificationId: eventSpecificationId
  });

  return createSmartAlertPath;
}

export function generateAlertConfig({
  boundaryScope,
  applicationId,
  serviceId,
  endpointId,
  includeSynthetic
}: GenerateAlertConfigProps) {
  const defaultRules = [
    {
      rule: defaultAlertRule,
      thresholdOperator: '>=',
      thresholds: {
        WARNING: {
          type: HISTORIC_BASELINE,
          deviationFactor: defaultDeviationFactor,
          isCheckboxSelected: true,
          seasonality: DAILY
        },
        CRITICAL: {
          type: HISTORIC_BASELINE,
          value: 0.0,
          deviationFactor: defaultDeviationFactor,
          isCheckboxSelected: false,
          seasonality: DAILY
        }
      }
    }
  ];

  return {
    boundaryScope,
    threshold: {
      type: HISTORIC_BASELINE,
      value: 0.0,
      seasonality: DAILY
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: getEntitySelection(applicationId, serviceId, endpointId),
    rules: defaultRules
  };
}

// this function is to display view selector dialog when carbon table is enabled
export function CreateSmartAlertButtonForCarbonTable({
  isGlobal,
  applicationId,
  boundaryScope: urlBoundaryScope,
  location,
  defaultBoundaryScope,
  buttonName
}: {
  isGlobal: boolean;
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  location: Location;
  defaultBoundaryScope?: string;
  buttonName: string;
}) {
  const getLinkToCreateSmartAlert = useSmartAlertCreateUrl();

  const createSmartAlertPath = getLinkToCreateSmartAlert({
    isGlobal: isGlobal,
    applicationId: !isGlobal ? applicationId : undefined,
    boundaryScope: urlBoundaryScope || defaultBoundaryScope
  });

  const openOldDialog = () => {
    addActiveDialog(
      <AlertConfigDialog
        isGlobalSmartAlert={isGlobal}
        startWithSimpleMode={!isGlobal}
        alertConfig={
          isGlobal
            ? generateGlobalAlertConfig()
            : generateAlertConfig({
                boundaryScope: urlBoundaryScope || defaultBoundaryScope,
                applicationId
              })
        }
        onClose={() => {
          close();

          if (location?.pathname === alertsTabListFullyQualified || location?.pathname === alertsList) {
            refreshSmartAlertConfigsList();
          }
        }}
      />
    );
  };

  return (
    <CarbonTableCreateButton
      openOldDialog={openOldDialog}
      createSmartAlertPath={createSmartAlertPath}
      isGlobal={isGlobal}
      buttonName={buttonName}
    />
  );
}
