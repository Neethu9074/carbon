/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { ReactNode } from 'react';

import { PER_AP } from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import { adaptiveBaselineEnabled } from 'in-services/featureFlags';
import { AlertEvaluationType } from 'in-types';
import { t } from 'in-i18n';

/**
 * This component is needed till adaptive–baselines are available.
 * It keeps the current behavior which is showing a label if only staticThreshold can be selected if adaptiveBaselineEnabled is turned off.
 */
interface Props {
  children: ReactNode;
  evaluationType?: AlertEvaluationType;
  isGlobalSmartAlert?: boolean;
}

export default function ShowStaticThresholdLabelOrDropdown({ children, evaluationType, isGlobalSmartAlert }: Props) {
  const canSelectBaseline = adaptiveBaselineEnabled || (evaluationType === PER_AP && !isGlobalSmartAlert);

  return canSelectBaseline ? (
    <>{children}</>
  ) : (
    <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold')}</div>
  );
}
