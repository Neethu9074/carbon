/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ApplicationBoundaryScope } from '@instana/types';
import { Button } from '@instana/components';

//@ts-expect-error
import { generateAlertConfig as generateGlobalAlertConfig } from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import CreateSmartAlertButton, {
  getButtonActions
} from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
//@ts-expect-error need migration
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { useSmartAlertCreateUrl } from 'in-alerting/smart-alerts/applications/hooks/useSmartAlertCreateUrl';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { isDialogAndTearSheetEnabled } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import { applicationSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
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

const showDialogAndTearSheetButton = isDialogAndTearSheetEnabled();

export default function CreateSmartAlert({
  applicationId,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  serviceId,
  endpointId,
  location
}: CreateSmartAlertProps) {
  if (!applicationId) {
    return null;
  }

  // Show floating button if both dialog and tearsheet are enabled.
  if (showDialogAndTearSheetButton) {
    return (
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <CreateSmartAlertDialog
            applicationId={applicationId}
            location={location}
            boundaryScope={urlBoundaryScope}
            defaultBoundaryScope={defaultBoundaryScope}
            includeSynthetic={includeSynthetic}
            serviceId={serviceId}
            endpointId={endpointId}
          />
          <CreateSmartAlertButton
            isGlobal={false}
            buttonName={getButtonName(t('in-alerting:smartAlerts.applications.components.createSmartAlert'))}
            boundaryScope={urlBoundaryScope}
            defaultBoundaryScope={defaultBoundaryScope}
            applicationId={applicationId}
            serviceId={serviceId}
            endpointId={endpointId}
          />
        </FloatingActionButtonMenu>
      </FloatingActionButtons>
    );
  }

  // Show button to add smart alert if tearSheet view is enabled.
  if (applicationSmartAlertFullScreenDesignEnabled) {
    return (
      <FloatingActionButtons>
        <CreateSmartAlertButton
          isGlobal={false}
          buttonName={getButtonName(t('in-alerting:smartAlerts.applications.components.createSmartAlert'))}
          boundaryScope={urlBoundaryScope}
          defaultBoundaryScope={defaultBoundaryScope}
          applicationId={applicationId}
          renderAsSimpleButton
          serviceId={serviceId}
          endpointId={endpointId}
        />
      </FloatingActionButtons>
    );
  }

  // by default, display the button for adding a smart alert.
  return (
    <FloatingActionButtons>
      <CreateSmartAlertDialog
        applicationId={applicationId}
        location={location}
        boundaryScope={urlBoundaryScope}
        defaultBoundaryScope={defaultBoundaryScope}
        includeSynthetic={includeSynthetic}
        serviceId={serviceId}
        endpointId={endpointId}
        renderAsFloatingButton={false}
      />
    </FloatingActionButtons>
  );
}

function CreateSmartAlertDialog({
  applicationId,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  serviceId,
  endpointId,
  location,
  renderAsFloatingButton = true
}: CreateSmartAlertProps) {
  const { trackCta } = useSegmentTracking();
  if (!applicationId) {
    return null;
  }
  const FloatingButtonComponent = renderAsFloatingButton ? Button : FloatingActionButton;

  return (
    <FloatingButtonComponent
      icon="lib_alerts_create"
      kind={'primaryv2'}
      onClick={() => {
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
        trackCta(ALERTING_CREATE);
      }}
    >
      {t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
    </FloatingButtonComponent>
  );
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
  defaultBoundaryScope
}: {
  isGlobal: boolean;
  applicationId: string;
  boundaryScope: ApplicationBoundaryScope;
  location: Location;
  defaultBoundaryScope?: string;
}) {
  const { trackCta } = useSegmentTracking();
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

  return getButtonActions(trackCta, openOldDialog, createSmartAlertPath);
}
