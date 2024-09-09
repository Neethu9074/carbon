/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { MapForm, MapFormItems } from 'formalistic';
import React from 'react';

import { isStepInvalid, StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { t } from 'in-i18n';

interface SimpleDialogFooterProps<FORM_TYPE extends MapFormItems> {
  backOrCancel: (step: number) => void;
  form: MapForm<FORM_TYPE>;
  formId: string;
  step: number;
  stepConfigs: StepConfigs;
  isSaving?: boolean;
  additionalStepCheck?: (step: number) => boolean;
  customSaveButtonText?: string;
  noStepCheckOnFirstStep?: boolean;
  renderCustomSaveAction?: () => React.ReactElement;
}

export function SimpleDialogFooter<FORM_TYPE extends MapFormItems>({
  step,
  formId,
  backOrCancel,
  form,
  stepConfigs,
  isSaving,
  additionalStepCheck = () => true,
  noStepCheckOnFirstStep = false,
  customSaveButtonText = t('in-components:blueprintFormMultistep.buttonCreate'),
  renderCustomSaveAction
}: SimpleDialogFooterProps<FORM_TYPE>) {
  const isDisabled =
    (step === stepConfigs.length - 1 && !form.hierarchyValid) ||
    isStepInvalid(step, stepConfigs, form) ||
    !additionalStepCheck(step);

  return (
    <DialogFooter
      form={form}
      formId={formId}
      primaryActionText={
        step === stepConfigs.length - 1 ? customSaveButtonText : t('in-components:blueprintFormMultistep.buttonNext')
      }
      onSecondaryActionClick={() => backOrCancel(step)}
      secondaryActionText={
        step === 0
          ? t('in-components:blueprintFormMultistep.buttonCancel')
          : t('in-components:blueprintFormMultistep.buttonBack')
      }
      primaryActionDisabled={noStepCheckOnFirstStep ? isDisabled : isDisabled && step !== 0}
      saving={isSaving}
      renderCustomSaveAction={renderCustomSaveAction}
    />
  );
}
