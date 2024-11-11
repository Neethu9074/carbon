/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

//@ts-expect-error need migration
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import CreateSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { isDialogAndTearSheetEnabled } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { defaultDeviationFactor } from 'in-alerting/smart-alerts/applications/form/thresholdForm';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { applicationSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { alertsTabListFullyQualified } from 'in-applications/navigation/paths';
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
          seasonality: DAILY
        },
        CRITICAL: {
          type: HISTORIC_BASELINE,
          value: 0.0,
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
