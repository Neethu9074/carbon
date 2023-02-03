/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import SmartAlertConfigDialogWrapper from 'in-alerting/smart-alerts/applications/dialog/SmartAlertConfigDialogWrapper';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import { applicationsAlertingAddAlert } from 'in-alerting/smart-alerts/applications/tracker';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { propTypeLocation } from 'in-stores/navigation';
import { t } from 'in-i18n';

export default function CreateGlobalSmartAlertButton({ renderAsSimpleButton, location }) {
  const buttonProps = {
    icon: 'lib_alerts_create',
    // i18n: primaryv2 is an internal technical name, no translation needed
    kind: 'primaryv2',
    onClick() {
      addActiveDialog(
        <SmartAlertConfigDialogWrapper
          isGlobalSmartAlert
          alertConfig={generateAlertConfig()}
          onClose={() => {
            close();
            if (location?.pathname === '/application/alerts' || location?.pathname === '/alerts') {
              refreshSmartAlertConfigsList();
            }
          }}
        />
      );
      applicationsAlertingAddAlert(location?.pathname, 'global');
    }
  };

  let Component = Button;
  if (!renderAsSimpleButton) {
    Component = FloatingActionButton;
    buttonProps.withBoxShadow = true;
  }

  return (
    <Component {...buttonProps}>
      {t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert')}
    </Component>
  );
}

CreateGlobalSmartAlertButton.propTypes = {
  location: propTypeLocation,
  renderAsSimpleButton: PropTypes.bool
};

function generateAlertConfig() {
  return {
    threshold: {
      type: STATIC_THRESHOLD
    }
  };
}
