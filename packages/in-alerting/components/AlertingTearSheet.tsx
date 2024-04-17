/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { MapForm } from 'formalistic';

import { AP_FORM_DATA } from 'in-alerting/smart-alerts/applications/tearSheet/AlertConfigTearSheetWithThreshold';
import AlertingTearSheetFooter from 'in-alerting/components/AlertingTearSheetFooter';
import AlertingTearSheetSteps from 'in-alerting/components/AlertingTearSheetSteps';

import locals from 'in-alerting/components/AlertingTearSheet.mless';

export type AlertingFooterActions = {
  kind: string;
  isLeftAlign: boolean;
  label: string;
  onClick: (arg?: React.MouseEvent<Element, MouseEvent> | number) => void;
};

export type AlertingTearSheetStepConfigs = {
  title: string;
  validateIntermediately?: string[];
  optional?: boolean;
  isBeta?: boolean;
  isOptional?: boolean;
};

export type SA_FORM_DATA = AP_FORM_DATA;

export interface AlertingTearSheetProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  actions: AlertingFooterActions[];
  stepConfigs: AlertingTearSheetStepConfigs[];
  formId: string;
  isSaving: boolean;
  children: ReactNode;
  form: MapForm<SA_FORM_DATA>;
  handleSubmit: () => void;
  isTagFilterFormModelValid?: boolean;
  migrationMode?: boolean;
}

export default function AlertingTearSheet(props: AlertingTearSheetProps) {
  const { form, actions, stepConfigs, step, setStep, formId, isSaving, children, handleSubmit } = props;

  return (
    <div data-testid="tearsheet">
      <form
        id={formId}
        onSubmit={e => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <section>
          <div className={locals.container}>
            <div className={locals.sidebar}>
              <AlertingTearSheetSteps stepConfigs={stepConfigs} step={step} setStep={setStep} />
            </div>
            <div className={locals.content}>{children}</div>
            <div className={locals.footer}>
              <AlertingTearSheetFooter
                form={form}
                formId={formId}
                actions={actions}
                isSaving={isSaving}
                step={step}
                stepConfigs={stepConfigs}
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
