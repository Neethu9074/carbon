/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { AlertingFooterActions, AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
import { CancelButton, PreviousButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { ALERTING_CANCEL_CLICKED } from 'in-services/tracking/eventNames';
import { t } from 'in-i18n';

import locals from './AlertingTearSheetFooter.mless';

interface AlertingTearSheetFooterProps {
  step: number;
  actions: AlertingFooterActions[];
  stepConfigs: AlertingTearSheetStepConfigs[];
  formId: string;
  isSaving: boolean;
  form: MapForm<any>;
  setForm: (form: MapForm<any>) => void;
  additionalValidationCheck: boolean;
}

export default function AlertingTearSheetFooter({
  form,
  formId,
  actions,
  isSaving,
  step,
  stepConfigs,
  setForm,
  additionalValidationCheck
}: AlertingTearSheetFooterProps) {
  //function for segment tracking
  const { trackCta } = useSegmentTracking();
  const leftAction = actions.filter((action: AlertingFooterActions) => action.isLeftAlign);
  const rightAction = actions.filter((action: AlertingFooterActions) => !action.isLeftAlign);
  const isLastStep = step === stepConfigs.length - 1;
  const stepTitle = stepConfigs[step]?.title;
  const formConfig = form.toJS();

  return (
    <div className={locals.formFooter}>
      {leftAction.length > 0 && (
        <div>
          {leftAction.map(
            (action: AlertingFooterActions) =>
              action.kind === 'ghost' && (
                <CancelButton
                  kind="subtle"
                  key={action.label}
                  href={action.href ?? undefined}
                  onClick={() => {
                    trackCta(ALERTING_CANCEL_CLICKED, { cancelClickedStep: stepTitle, ...formConfig });
                  }}
                >
                  {action.label}
                </CancelButton>
              )
          )}
        </div>
      )}

      {rightAction.length > 0 && (
        <div>
          {rightAction.map((action: AlertingFooterActions, i: number) => (
            <span key={i}>
              {action.kind === 'secondary' && (
                <PreviousButton
                  kind="secondary"
                  key={action.label}
                  className={locals.button}
                  onClick={() => action.onClick && action.onClick(step)}
                  isDisabled={step === 0}
                >
                  {action.label}
                </PreviousButton>
              )}
              {action.kind === 'primary' && (
                <SaveButton
                  type="submit"
                  kind="primary"
                  formId={formId}
                  isSaving={isSaving}
                  onClick={() => {
                    // This is to trigger validation of the form against each step.
                    if (!stepConfigs[step].valid) {
                      const validator = stepConfigs[step]?.validator;
                      if (typeof validator === 'function') {
                        return validator();
                      }
                    }
                    if (!additionalValidationCheck) {
                      return;
                    }
                    // trigger validation if only at final step
                    if (form && !form.hierarchyValid && isLastStep) {
                      setForm?.(form.setTouched(true, { recurse: true }));
                      return;
                    }
                    if (action.onClick) {
                      (action.onClick as () => void)();
                    }
                  }}
                  disabled={isLastStep && isSaving}
                >
                  {isLastStep ? action.label : t('in-components:blueprintFormMultistep.buttonNext')}
                </SaveButton>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
