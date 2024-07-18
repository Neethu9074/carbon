/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData } from '@instana/types';
import { CarbonLayer } from '@instana/components';

import AlertingTearSheetFooter from 'in-alerting/components/AlertingTearSheetFooter';
import AlertingTearSheetSteps from 'in-alerting/components/AlertingTearSheetSteps';

import locals from 'in-alerting/components/AlertingTearSheet.mless';

export type AlertingFooterActions = {
  kind: string;
  isLeftAlign: boolean;
  label: string;
  onClick: (arg?: React.MouseEvent<Element, MouseEvent> | number) => void;
  href?: string;
};

export type AlertingTearSheetStepConfigs = {
  title: string;
  validateIntermediately?: string[][];
  optional?: boolean;
  isBeta?: boolean;
  isOptional?: boolean;
  valid?: boolean;
};

export interface AlertingTearSheetProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  actions: AlertingFooterActions[];
  stepConfigs: AlertingTearSheetStepConfigs[];
  formId: string;
  isSaving: boolean;
  children: ReactNode;
  form: MapForm<any>;
  migrationMode?: boolean;
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null;
  additionalValidationCheck: boolean;
  headerWithMsg: boolean;
  setForm: (form: MapForm<any>) => void;
}

export default function AlertingTearSheet(props: AlertingTearSheetProps) {
  const {
    form,
    actions,
    stepConfigs,
    step,
    setStep,
    formId,
    isSaving,
    children,
    additionalValidationCheck,
    setForm,
    headerWithMsg,
    migrationMode
  } = props;

  return (
    <div data-testid="tearsheet">
      <section className={locals.outerContainer}>
        <CarbonLayer>
          <div
            className={classNames({
              [locals.container]: true,
              [locals.containerWithMsg]: headerWithMsg
            })}
          >
            <div className={locals.sidebar}>
              <AlertingTearSheetSteps stepConfigs={stepConfigs} step={step} setStep={setStep} form={form} />
            </div>
            <div
              className={classNames({
                [locals.content]: true,
                [locals.contentWithMsg]: headerWithMsg
              })}
            >
              {children}
            </div>
            <div className={locals.footer}>
              <AlertingTearSheetFooter
                form={form}
                formId={formId}
                actions={actions}
                isSaving={isSaving}
                step={step}
                stepConfigs={stepConfigs}
                setForm={setForm}
                migrationMode={migrationMode}
                additionalValidationCheck={additionalValidationCheck}
              />
            </div>
          </div>
        </CarbonLayer>
      </section>
    </div>
  );
}
