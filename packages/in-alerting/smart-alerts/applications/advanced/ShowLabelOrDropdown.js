/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

/**
 * This component is needed till adaptive–baselines are available.
 * It keeps the current behavior which is showing a label if only staticThreshold can be selected if adaptiveBaselineEnabled is turned off.
 */
export default function ShowLabelOrDropdown({ children, form, isGlobalSmartAlert }) {
  const canSelectBaseline =
    adaptiveBaselineEnabled || (form.get('evaluationType').value === PER_AP && !isGlobalSmartAlert);

  return canSelectBaseline ? (
    <>{children}</>
  ) : (
    <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>
  );
}
