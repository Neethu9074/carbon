/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Stack, Button } from '@instana/components';

import {
  applicationSmartAlertFullScreenDesignEnabled,
  applicationSmartAlertDialogView
} from 'in-services/featureFlags';
import CreateSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import { refreshSmartAlertConfigsList } from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import { isDialogAndTearSheetEnabled } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import AlertConfigDialog from 'in-alerting/smart-alerts/applications/dialog/AlertConfigDialog';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { alertsList, alertsTabListFullyQualified } from 'in-applications/navigation/paths';
import { defaultAlertRule } from 'in-alerting/smart-alerts/applications/form/ruleForm';
import { getButtonName } from 'in-alerting/smart-alerts/components/utils/alertUtils';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FloatingActionButton from 'in-components/FloatingActionButton';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { propTypeLocation } from 'in-stores/navigation';
import { t } from 'in-i18n';

const showDialogAndTearSheetButton = isDialogAndTearSheetEnabled();

export default function CreateGlobalSmartAlertButton({ renderAsSimpleButton, location }) {
  const { trackCta } = useSegmentTracking();
  const buttonProps = {
    icon: 'lib_alerts_create',
    // i18n: primaryv2 is an internal technical name, no translation needed
    kind: 'primaryv2',
    onClick() {
      addActiveDialog(
        <AlertConfigDialog
          isGlobalSmartAlert
          alertConfig={generateAlertConfig()}
          onClose={() => {
            close();

            if (location?.pathname === alertsTabListFullyQualified || location?.pathname === alertsList) {
              refreshSmartAlertConfigsList();
            }
          }}
        />
      );
      trackCta(ALERTING_CREATE);
    }
  };

  if (renderAsSimpleButton) {
    return (
      <Stack gap="normal" align="end">
        {applicationSmartAlertDialogView && (
          <Button {...buttonProps}>
            {t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert')}
          </Button>
        )}
        {applicationSmartAlertFullScreenDesignEnabled && (
          <CreateSmartAlertButton
            isGlobal
            buttonName={getButtonName(t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert'))}
          />
        )}
      </Stack>
    );
  }

  // Show floating button if both dialog and tearsheet are enabled.
  if (showDialogAndTearSheetButton) {
    return (
      <FloatingActionButtons>
        <FloatingActionButtonMenu>
          <Button {...buttonProps}>
            {t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert')}
          </Button>
          <CreateSmartAlertButton
            isGlobal
            buttonName={getButtonName(t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert'))}
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
          isGlobal
          buttonName={getButtonName(t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert'))}
          renderAsSimpleButton
        />
      </FloatingActionButtons>
    );
  }

  let Component = Button;
  Component = FloatingActionButton;
  buttonProps.withBoxShadow = true;

  // by default, display the button for adding a smart alert.
  return (
    <FloatingActionButtons>
      <Component {...buttonProps}>
        {t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlert')}
      </Component>
    </FloatingActionButtons>
  );
}

CreateGlobalSmartAlertButton.propTypes = {
  location: propTypeLocation,
  renderAsSimpleButton: PropTypes.bool
};

function generateAlertConfig() {
  return {
    rules: [
      {
        rule: defaultAlertRule,
        thresholdOperator: '>=',
        thresholds: {
          WARNING: {
            type: STATIC_THRESHOLD,
            isCheckboxSelected: false
          },
          CRITICAL: {
            type: STATIC_THRESHOLD,
            isCheckboxSelected: false
          }
        }
      }
    ]
  };
}
