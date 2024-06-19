/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { AlertingFooterActions, AlertingTearSheetStepConfigs } from 'in-alerting/components/AlertingTearSheet';
import { CancelButton, PreviousButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
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
  migrationMode?: boolean;
}

export default function AlertingTearSheetFooter({
  form,
  formId,
  actions,
  isSaving,
  step,
  stepConfigs,
  setForm,
  migrationMode
}: AlertingTearSheetFooterProps) {
  const leftAction = actions.filter((action: AlertingFooterActions) => action.isLeftAlign);
  const rightAction = actions.filter((action: AlertingFooterActions) => !action.isLeftAlign);
  const isLastStep = step === stepConfigs.length - 1;

  return (
    <div className={locals.formFooter}>
      {leftAction.length > 0 && (
        <div>
          {leftAction.map(
            (action: AlertingFooterActions) =>
              action.kind === 'ghost' && (
                <CancelButton key={action.label} href={action.href}>
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
                  key={action.label}
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
                    if (!action.onClick) {
                      return;
                    }
                    // trigger validation if only at final step
                    if (form && !form.hierarchyValid && isLastStep) {
                      setForm?.(form.setTouched(true, { recurse: true }));
                      return;
                    }
                    action.onClick();
                  }}
                  disabled={isLastStep && isSaving}
                >
                  {getSaveButtonLabel(action.label, isLastStep, migrationMode)}
                </SaveButton>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function getSaveButtonLabel(defaultLabel: string, isLastStep: boolean, migrationMode?: boolean) {
  if (isLastStep) {
    return migrationMode ? t('in-alerting:smartAlerts.components.smartAlertDialog.buttonMigrate') : defaultLabel;
  }
  return t('in-components:blueprintFormMultistep.buttonNext');
}
