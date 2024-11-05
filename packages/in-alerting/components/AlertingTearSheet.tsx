/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, ReactNode, SetStateAction } from 'react';
import { MapForm } from 'formalistic';
import classNames from 'classnames';

import { CarbonLayer } from '@instana/components';

import AlertingTearSheetFooter from 'in-alerting/components/AlertingTearSheetFooter';
import AlertingTearSheetSteps from 'in-alerting/components/AlertingTearSheetSteps';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { Nullish } from 'in-types';

import locals from 'in-alerting/components/AlertingTearSheet.mless';

export type AlertingFooterActions = {
  kind: string;
  isLeftAlign: boolean;
  label: string;
  onClick?: ((arg: number) => void) | (() => void);
  href?: string | Nullish;
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
  additionalValidationCheck: boolean;
  headerWithMsg: boolean;
  setForm: (form: MapForm<any>) => void;
  productArea: string;
  sideNavigationEnabled?: boolean;
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
    productArea,
    sideNavigationEnabled
  } = props;

  return (
    <div data-testid="tearsheet">
      <ViewTrackingMeta
        data={{
          productArea: productArea,
          pageRootName: pageNames.smart_alerts_tearsheet
        }}
      />
      <section className={locals.outerContainer}>
        <CarbonLayer>
          <div
            className={classNames({
              [locals.container]: true,
              [locals.containerWithMsg]: headerWithMsg
            })}
          >
            <div className={locals.sidebar}>
              <AlertingTearSheetSteps
                stepConfigs={stepConfigs}
                step={step}
                setStep={setStep}
                form={form}
                sideNavigationEnabled={sideNavigationEnabled}
              />
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
                additionalValidationCheck={additionalValidationCheck}
              />
            </div>
          </div>
        </CarbonLayer>
      </section>
    </div>
  );
}
