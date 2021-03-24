/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/Dialog/SmartAlertConfigDialogWrapper';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import { applicationsAlertingAddAlert } from 'in-alerting/smart-alerts/applications/tracker';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-new-components/FloatingActionButton';
import { boundaryScopes } from 'in-applications/constants';
import { propTypeLocation } from 'in-stores/navigation';
import Button from 'in-new-components/Button';
import { t } from 'in-i18n';

export default function CreateGlobalSmartAlertButton({ renderAsSimpleButton, location }) {
  if (location?.pathname.includes('/application/configuration')) {
    // hide button on the config page
    return null;
  }

  const Component = renderAsSimpleButton ? Button : FloatingActionButton;

  return (
    <Component
      icon="lib_alerts_create"
      iconType="lib_alerts_create"
      kind="primaryv2"
      onClick={() => {
        addActiveDialog(
          <SmartAlertConfigDialogWrapper
            isGlobalSmartAlert
            formData={generateFormData()}
            onClose={() => {
              close();
              if (location?.pathname === '/application/alerts' || location?.pathname === '/alerts') {
                refreshSmartAlertConfigsList();
              }
            }}
          />
        );
        applicationsAlertingAddAlert(location?.pathname, 'global');
      }}
      withBoxShadow
    >
      {t('in-alerting:smartAlerts.applications.components.createSmartAlert')}
    </Component>
  );
}

CreateGlobalSmartAlertButton.propTypes = {
  location: propTypeLocation,
  renderAsSimpleButton: PropTypes.bool
};

function generateFormData() {
  return {
    boundaryScope: boundaryScopes.inbound,
    rule: {
      alertType: 'slowness',
      operator: 'EQUALS',
      metricName: 'latency'
    },
    threshold: {
      type: 'historicBaseline',
      value: 0.0,
      seasonality: 'DAILY'
    },
    calculateThresholdOnBackend: true,
    includeSynthetic: false,
    applications: {}
  };
}
