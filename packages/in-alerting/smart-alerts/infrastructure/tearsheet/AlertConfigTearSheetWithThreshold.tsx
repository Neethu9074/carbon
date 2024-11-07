/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import { TimeConfig } from '@instana/types';

import {
  infraStepRenderers,
  stepConfigs,
  getFooterActions,
  stepRendersType
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/TearSheetStepConfigs';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import useAlertConfigValidation from 'in-alerting/smart-alerts/infrastructure/hooks/useAlertConfigValidation';
import AlertingTearSheet from 'in-alerting/components/AlertingTearSheet';
import { productAreas } from 'in-services/tracking/productAreas';
import { Nullish } from 'in-types';

const FORM_ID = 'smart-alert-editor';

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  editMode: boolean;
  timeConfig: TimeConfig;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  withTrackClose: () => void;
  cancelTearSheet: () => string | Nullish;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, updateForm, editMode, withTrackClose, isSaving, cancelTearSheet, onCreate } = props;

  const { step, setStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: () => onCreate(true),
    onClose: withTrackClose
  });

  const actions = getFooterActions(backOrCancel, cancelTearSheet, handleSubmit, editMode);

  const navItems = useAlertConfigValidation(stepConfigs);

  return (
    <AlertingTearSheet
      step={step}
      setStep={setStep}
      actions={actions}
      stepConfigs={navItems}
      isSaving={isSaving}
      formId={FORM_ID}
      form={form}
      setForm={updateForm}
      sideNavigationEnabled={editMode}
      productArea={productAreas.infrastructure}
      headerWithMsg={false}
      additionalValidationCheck
    >
      {infraStepRenderers.map((Renderer: (props: stepRendersType) => JSX.Element, idx: number) => {
        return (
          step === idx && (
            <Renderer
              {...props}
              key={`key-${idx}`}
              isTagFilterFormModelValid
              thresholdResult={undefined}
              setStep={setStep}
            />
          )
        );
      })}
    </AlertingTearSheet>
  );
}
