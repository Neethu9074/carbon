/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import { getEntitySelection } from 'in-alerting/smart-alerts/applications/data/entitySelection';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { trackStartCreate } from 'in-alerting/smart-alerts/components/tracker';
import { alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { DAILY } from 'in-alerting/smart-alerts/data/seasonalities';
import { propTypeLocation } from 'in-stores/navigation';
import { reload } from 'in-settings/components/List';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function CreateSmartAlert({
  applicationId,
  boundaryScope: urlBoundaryScope,
  defaultBoundaryScope,
  includeSynthetic,
  serviceId,
  endpointId,
  location
}) {
  if (isBlank(applicationId)) {
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
                reload();
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

CreateSmartAlert.propTypes = {
  applicationId: PropTypes.string,
  serviceId: PropTypes.string,
  endpointId: PropTypes.string,
  location: propTypeLocation.isRequired,
  boundaryScope: PropTypes.string,
  defaultBoundaryScope: PropTypes.string,
  includeSynthetic: PropTypes.bool
};

export function generateAlertConfig({ boundaryScope, applicationId, serviceId, endpointId, includeSynthetic }) {
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
