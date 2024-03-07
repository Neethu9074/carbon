/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

//@ts-expect-error need migration
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { trackStartCreate } from 'in-alerting/smart-alerts/components/tracker';
import { alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
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
  if (!applicationId) {
    return null;
  }

  return (
    <FloatingActionButton
      icon="lib_alerts_create"
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
        trackStartCreate();
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
    </FloatingActionButton>
  );
}

export function generateAlertConfig({
  boundaryScope,
  applicationId,
  serviceId,
  endpointId,
  includeSynthetic
}: GenerateAlertConfigProps) {
  return {
    boundaryScope,
    threshold: {
      type: HISTORIC_BASELINE,
      value: 0.0,
      seasonality: DAILY
    },
    calculateThresholdOnBackend: true,
    includeSynthetic,
    applications: getEntitySelection(applicationId, serviceId, endpointId)
  };
}
