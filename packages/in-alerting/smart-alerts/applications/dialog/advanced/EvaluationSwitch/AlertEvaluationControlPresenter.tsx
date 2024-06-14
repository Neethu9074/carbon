/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { themes } from '@instana/design-tokens';
import { Spacer } from '@instana/components';

import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import { AlertEvaluationType } from 'in-types';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/AlertEvaluationControl.mless';

interface Props {
  isBuiltIn?: boolean;
  evaluationType: AlertEvaluationType;
  isAdaptiveThreshold?: boolean;
  isGlobalSmartAlert?: boolean;
  setEvaluationType: (type: AlertEvaluationType) => void;
  tearSheetView?: boolean;
}

export function AlertEvaluationControlPresenter({
  isBuiltIn,
  evaluationType,
  isAdaptiveThreshold,
  isGlobalSmartAlert,
  setEvaluationType,
  tearSheetView
}: Props) {
  if (isBuiltIn) {
    return (
      <div className={locals.readOnlyAlertEvaluationContainer}>
        <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
      </div>
    );
  }

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

  const TearSheetCheckbox = ({ type, disabled }: { type: AlertEvaluationType; disabled?: boolean }) => (
    <CheckboxFancy
      key={alertEvaluationTypes[type].tearSheetSelectionText}
      label={
        <LabelDescriptionWithIcon
          label={alertEvaluationTypes[type].tearSheetSelectionText}
          description={alertEvaluationTypes[type].tearSheetDescription}
        >
          <>
            <Spacer vertical="normal" />
            <Spacer vertical="xsmall" />
          </>
        </LabelDescriptionWithIcon>
      }
      checked={type === evaluationType}
      onChange={() => setEvaluationType(type)}
      asRadioButton
      disabled={disabled}
    />
  );

  return (
    <div className={classNames({ [locals.container]: !tearSheetView })}>
      {!tearSheetView && (
        <IconLabel
          type="lib_alerts_multiple_alerts"
          text={t('in-alerting:smartAlerts.applications.advanced.evaluationSwitch.individual')}
          noBottomMargin
          color={themes.default.ids.color.option.neutral['600']}
        />
      )}

      <div className={classNames({ [locals.options]: !tearSheetView, [locals.tearsheetOptions]: tearSheetView })}>
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
          ) : tearSheetView ? (
            <TearSheetCheckbox key={evalType} type={type} />
          ) : (
            <Checkbox key={evalType} type={type} />
          );
        })}
      </div>
    </div>
  );
}
