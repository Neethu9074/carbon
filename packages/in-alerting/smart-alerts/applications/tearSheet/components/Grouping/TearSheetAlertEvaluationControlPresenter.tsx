/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import OptionBox from 'in-applications/components/OptionBox';
import { AlertEvaluationType } from 'in-types';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './TearSheetAlertEvaluationControl.mless';

interface Props {
  isBuiltIn?: boolean;
  evaluationType: AlertEvaluationType;
  isAdaptiveThreshold?: boolean;
  isGlobalSmartAlert?: boolean;
  setEvaluationType: (type: AlertEvaluationType) => void;
}

export function TearSheetAlertEvaluationControlPresenter({
  isBuiltIn,
  evaluationType,
  isAdaptiveThreshold,
  isGlobalSmartAlert,
  setEvaluationType
}: Props) {
  if (isBuiltIn) {
    return (
      <div className={locals.readOnlyAlertEvaluationContainer}>
        <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
      </div>
    );
  }

  const Checkbox = ({ type, disabled }: { type: AlertEvaluationType; disabled?: boolean }) => (
    <OptionBox
      icon=""
      title={alertEvaluationTypes[type].tearSheetSelectionText}
      asRadioButton
      className={classNames({
        [locals.optionBox]: true,
        [locals.optionBoxUnchecked]: type !== evaluationType
      })}
      description={alertEvaluationTypes[type].tearSheetDescription}
      checked={type === evaluationType}
      onChange={() => setEvaluationType(type)}
      disabled={disabled}
    />
  );

  return (
    <div className={locals.container}>
      <div className={locals.options}>
        {Object.keys(alertEvaluationTypes).map(evalType => {
          const type = evalType as AlertEvaluationType;
          const notAvailableWithAdaptiveThreshold =
            isAdaptiveThreshold && !alertEvaluationTypes[type].enabledForAdaptiveThreshold;

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
