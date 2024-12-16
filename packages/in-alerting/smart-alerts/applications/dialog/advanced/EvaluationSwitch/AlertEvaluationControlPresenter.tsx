/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import classNames from 'classnames';
import React from 'react';

import { RadioButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { Spacer } from '@instana/components';

import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import ReadOnlyAlertEvaluation from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/ReadOnlyAlertEvaluation';
import alertEvaluationTypes from 'in-alerting/smart-alerts/applications/dialog/advanced/EvaluationSwitch/alertEvaluationTypes';
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
  evaluationCount?: { PER_AP: number; PER_AP_SERVICE: number; PER_AP_ENDPOINT: number };
}

export function AlertEvaluationControlPresenter({
  isBuiltIn,
  evaluationType,
  isAdaptiveThreshold,
  isGlobalSmartAlert,
  setEvaluationType,
  tearSheetView,
  evaluationCount
}: Props) {
  if (isBuiltIn) {
    return (
      <div className={locals.readOnlyAlertEvaluationContainer}>
        <ReadOnlyAlertEvaluation evaluationType={evaluationType} isGlobalSmartAlert={isGlobalSmartAlert} />
      </div>
    );
  }

  const Checkbox = ({ type, disabled }: { type: AlertEvaluationType; disabled?: boolean }) => (
    <RadioButton
      key={type}
      disabled={disabled}
      label={
        isGlobalSmartAlert ? alertEvaluationTypes[type].globalSelectionText : alertEvaluationTypes[type].selectionText
      }
      checked={type === evaluationType}
      onChange={() => setEvaluationType(type)}
    />
  );

  const TearSheetCheckbox = ({ type, disabled }: { type: AlertEvaluationType; disabled?: boolean }) => (
    <RadioButton
      key={alertEvaluationTypes[type].tearSheetSelectionText}
      label={
        <LabelDescriptionWithIcon
          label={alertEvaluationTypes[type].tearSheetSelectionText}
          description={
            evaluationCount?.[type]
              ? alertEvaluationTypes[type].tearSheetDescription(getEvaluationCount(evaluationCount[type]))
              : alertEvaluationTypes[type].tearSheetDescription(0)
          }
        >
          <>
            <Spacer vertical="normal" />
            <Spacer vertical="xsmall" />
          </>
        </LabelDescriptionWithIcon>
      }
      checked={type === evaluationType}
      onChange={() => setEvaluationType(type)}
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

      <div className={classNames({ [locals.options]: !tearSheetView, [locals.tearSheetOptions]: tearSheetView })}>
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
                {tearSheetView ? (
                  <TearSheetCheckbox key={evalType} type={type} disabled />
                ) : (
                  <Checkbox type={type} disabled />
                )}
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

function getEvaluationCount(evaluationCount: any) {
  if (evaluationCount === 'loading' || evaluationCount?.[0]?.message) {
    return '-';
  }
  return evaluationCount;
}
