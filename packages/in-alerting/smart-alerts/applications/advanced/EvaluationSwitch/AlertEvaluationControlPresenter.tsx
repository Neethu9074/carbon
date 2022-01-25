/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import alertEvaluationTypes, {
  PER_AP
} from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/alertEvaluationTypes';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import { AlertEvaluationType } from 'in-types';
import Tooltip from 'in-components/Tooltip';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/EvaluationSwitch/AlertEvaluationControl.mless';

interface Props {
  isBuiltIn?: boolean;
  evaluationType: AlertEvaluationType;
  isAdaptiveThreshold?: boolean;
  isGlobalSmartAlert?: boolean;
  setEvaluationType: (type: AlertEvaluationType) => void;
}

export function AlertEvaluationControlPresenter({
  isBuiltIn,
  evaluationType,
  isAdaptiveThreshold,
  isGlobalSmartAlert,
  setEvaluationType
}: Props) {
  const Checkbox = ({ type, disabled }: { type: AlertEvaluationType; disabled?: boolean }) => (
    <CheckboxFancy
      key={type}
      disabled={disabled}
      label={
        isGlobalSmartAlert ? alertEvaluationTypes[type].globalSelectionText : alertEvaluationTypes[type].selectionText
      }
      checked={type === evaluationType}
      onChange={() => setEvaluationType(type)}
      asRadioButton
    />
  );

  if (isBuiltIn) {
    return (
      <div className={locals.readOnlyAlertEvaluationContainer}>
        <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
      </div>
    );
  }

  return (
    <div className={locals.container}>
      <IconLabel
        type="lib_alerts_multiple_alerts"
        text={t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.individual')}
        noBottomMargin
        color={theme.lib.colors.N600Light}
      />

      <div className={locals.options}>
        {Object.keys(alertEvaluationTypes).map(evalType => {
          const type = evalType as AlertEvaluationType;
          const notAvailableWithAdaptiveThreshold = isAdaptiveThreshold && type !== PER_AP;

          return notAvailableWithAdaptiveThreshold ? (
            <Tooltip
              key={evalType}
              content={t(
                'in-alerting:smartAlerts.applications.advanced.evaluationSwitch.optionNotAvailableForAdaptiveThreshold'
              )}
              delay={500}
            >
              <div>
                <Checkbox type={type} disabled />
              </div>
            </Tooltip>
          ) : (
            <Checkbox key={evalType} type={type} />
          );
        })}
      </div>
    </div>
  );
}
