/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { CancelButton, PreviousButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { AlertingFooterActions, SA_FORM_DATA } from 'in-alerting/components/AlertingTearSheet';
import { t } from 'in-i18n';

import locals from './AlertingTearSheetFooter.mless';

interface AlertingTearSheetFooterProps {
  step: number;
  actions: AlertingFooterActions[];
  stepConfigs: Object[];
  formId: string;
  isSaving: boolean;
  form: MapForm<SA_FORM_DATA>;
}

export default function AlertingTearSheetFooter({
  form,
  formId,
  actions,
  isSaving,
  step,
  stepConfigs
}: AlertingTearSheetFooterProps) {
  const leftAction = actions.filter((action: AlertingFooterActions) => action.isLeftAlign);
  const rightAction = actions.filter((action: AlertingFooterActions) => !action.isLeftAlign);

  const primaryActionDisabled = false; // TODO add validation

  return (
    <div className={locals.formFooter}>
      {leftAction.length > 0 && (
        <div>
          {leftAction.map(
            (action: AlertingFooterActions) =>
              action.kind === 'ghost' && (
                <CancelButton key={action.label} onClick={() => action.onClick}>
                  {action.label}
                </CancelButton>
              )
          )}
        </div>
      )}

      {rightAction.length > 0 && (
        <div>
          {rightAction.map((action: AlertingFooterActions) => (
            <>
              {action.kind === 'secondary' && (
                <PreviousButton key={action.label} onClick={() => action.onClick(step)} isDisabled={step === 0}>
                  {action.label}
                </PreviousButton>
              )}
              {action.kind === 'primary' && (
                <SaveButton
                  type="submit"
                  kind="primary"
                  form={form}
                  formId={formId}
                  isSaving={isSaving}
                  onClick={action.onClick}
                  disabled={primaryActionDisabled}
                >
                  {step === stepConfigs.length - 1
                    ? action.label
                    : t('in-components:blueprintFormMultistep.buttonNext')}
                </SaveButton>
              )}
            </>
          ))}
        </div>
      )}
    </div>
  );
}
