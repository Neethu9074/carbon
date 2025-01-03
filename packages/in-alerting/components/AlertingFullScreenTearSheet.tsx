/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useState } from 'react';
import { MapForm, Item } from 'formalistic';

import { CreateFullPage, CreateFullPageProps, CreateFullPageStep } from '@instana/ibm-products';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { AdaptiveBaselineData, HistoricBaselineData, Result, StaticThresholdData, TimeConfig } from 'in-types';
import AlertingCarbonTearSheetContent from 'in-alerting/components/AlertingCarbonTearSheetContent';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './AlertingFullScreenTearSheet.mless';

export type AlertingTearSheetStepConfigs = {
  title: string;
  validateIntermediately?: string[][];
  component: React.ComponentType<any>;
  optional?: boolean;
  valid?: boolean;
  validator?: VoidFunction;
};

interface AlertingFullScreenTearSheetProps {
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
  withTrackClose: VoidFunction;
  cancelTearSheet: string;
  tearSheetTitle: string;
  isTagFilterFormModelValid?: boolean;
  stepConfigs: AlertingTearSheetStepConfigs[];
  handleFormSubmit: VoidFunction;
  isEditMode: boolean;
  setTagFilterValid?: React.Dispatch<React.SetStateAction<boolean>>;
  thresholdResult: Result<StaticThresholdData | AdaptiveBaselineData | HistoricBaselineData> | undefined | null;
  actionButtonLabel: string;
}

export default function AlertingFullScreenTearSheet(props: AlertingFullScreenTearSheetProps) {
  const { goToPath } = useNavigation();
  const {
    form,
    tearSheetTitle,
    cancelTearSheet,
    updateForm,
    stepConfigs,
    handleFormSubmit,
    isEditMode,
    actionButtonLabel
  } = props;

  const simulatedDelay = 750;
  const lastStepIndex = stepConfigs.length - 1;

  const [stepValid, setStepValid] = useState(true);
  const [errorStep, setErrorStep] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);

  /**
   * Helper function to validate the current step
   */
  const validateCurrentStep = (
    index: number,
    validateIntermediately?: string[][],
    valid?: boolean,
    validator?: VoidFunction
  ) => {
    if (!valid) {
      setStepValid(false);
      if (typeof validator === 'function') validator();
      validateStep(form, updateForm, validateIntermediately);
      setErrorStep(index);
      return false;
    }
    setErrorStep(null);
    setStepValid(true);
    return true;
  };

  /**
   *`handleSubmit` function handles the final submission of the form
   */
  const handleSubmit = () => {
    const { valid, validator, validateIntermediately } = stepConfigs[lastStepIndex];
    if (!validateCurrentStep(lastStepIndex, validateIntermediately, valid, validator)) return;
    handleFormSubmit();
  };

  /**
   * `args` returns the arguments that need to be passed to the tearSheet `CreateFullPage` component
   */
  const args: CreateFullPageProps = useMemo(
    () => ({
      backButtonText: t('in-alerting:smartAlerts.components.smartAlertDialog.previousTitle'),
      cancelButtonText: t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle'),
      nextButtonText: t('in-alerting:smartAlerts.components.smartAlertDialog.nextTitle'),
      onRequestSubmit: handleSubmit,
      submitButtonText: actionButtonLabel,
      onClose: () => goToPath(cancelTearSheet.slice(2)),
      title: tearSheetTitle,
      modalDangerButtonText: t('in-alerting:smartAlerts.components.smartAlertDialog.cancelTitle'),
      modalSecondaryButtonText: t('in-alerting:smartAlerts.components.smartAlertDialog.closeTitle'),
      modalTitle: t('in-alerting:smartAlerts.components.tearSheet.cancelModalTitle'),
      modalDescription: t('in-alerting:smartAlerts.components.tearSheet.cancelModalDescription')
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cancelTearSheet, goToPath, handleSubmit, isEditMode, stepConfigs, tearSheetTitle]
  );

  if (isEditMode) {
    args.onClickInfluencerStep = (index: number) =>
      new Promise<void>((resolve, reject) => {
        const { valid, validator, validateIntermediately } = stepConfigs[currentStep];
        if (!validateCurrentStep(currentStep, validateIntermediately, valid, validator))
          return reject(new Error(`Validation failed for step ${currentStep}`));
        setCurrentStep(index);
        resolve();
      }).catch(() => {
        // catch validation error
      });
    args.initialStep = currentStep + 1;
  }

  /**
   * `handleNext` function is used to validate each step in the form
   */
  const handleNext = (index: number, validateIntermediately?: string[][], valid?: boolean, validator?: () => void) =>
    new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (!validateCurrentStep(index, validateIntermediately, valid, validator)) return reject();
        resolve();
      }, simulatedDelay);
    });

  return (
    <div className={locals.fullPage}>
      <CreateFullPage {...args}>
        {stepConfigs.map(
          (
            { title, validateIntermediately, validator, valid, component: StepComponent }: AlertingTearSheetStepConfigs,
            index: number
          ) => (
            //@ts-expect-error `CreateFullPageStep`type definition is not accepting children
            <CreateFullPageStep
              key={index}
              title={title}
              invalid={errorStep === index ? !stepValid : false}
              onNext={() => handleNext(index, validateIntermediately, valid, validator)}
              disableSubmit={false}
              onMount={() => setCurrentStep(index)}
            >
              <RenderPageContent currentStep={currentStep} StepComponent={StepComponent} index={index} {...props} />
            </CreateFullPageStep>
          )
        )}
      </CreateFullPage>
    </div>
  );
}

/**
 * function is a React component that renders the content for each step in the form
 */
function RenderPageContent({
  currentStep,
  StepComponent,
  index,
  ...props
}: AlertingFullScreenTearSheetProps & { currentStep: number; StepComponent: React.ComponentType<any>; index: number }) {
  if (index === currentStep) {
    return (
      <AlertingCarbonTearSheetContent>
        <StepComponent {...props} key={currentStep} />
      </AlertingCarbonTearSheetContent>
    );
  }
  return null;
}

type FieldPath = string[];

/**
 * `validateStep` function is used to validate each step in the form
 */
export function validateStep(
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  validateIntermediately?: string[][]
) {
  const fieldsToValidate = validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return true;
  }

  let valid = true;
  fieldsToValidate.forEach((fieldPath: FieldPath) => {
    try {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      const field: Item = form.getIn(fieldPath);

      if (field && !field.valid) {
        updateForm(form.updateIn(fieldPath as any, (f: Item) => f.setTouched(true)));
        valid = false;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });

  return valid;
}
