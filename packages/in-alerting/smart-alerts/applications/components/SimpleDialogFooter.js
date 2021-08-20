/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { useObservable } from '@instana/hooks';

import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { t } from 'in-i18n';

SimpleDialogFooter.propTypes = {
  backOrCancel: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  formId: PropTypes.string.isRequired,
  step: PropTypes.number.isRequired,
  setStep: PropTypes.func.isRequired,
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ).isRequired,
  simpleModeStep: PropTypes.number,
  isSaving: PropTypes.bool,
  additionalStepCheck: PropTypes.func
};

export function SimpleDialogFooter({
  step,
  setStep,
  formId,
  backOrCancel,
  form,
  simpleModeStep,
  stepConfigs,
  isSaving,
  additionalStepCheck = () => true
}) {
  const isCalculatingThreshold = useObservable(thresholdOrBaselineLoadingSignal$, []);

  // TODO: investigate: This was copied from SimpleModePageNavigation, and might not be need anymore
  // see also https://github.com/instana/ui-client/pull/7185/files/474e0a1c80115372cc3e1c9fe472ad90a296c8c2#r692886769
  useEffect(() => {
    if (simpleModeStep && simpleModeStep > step) {
      setStep(simpleModeStep);
    }
    // only call this once when switching to simple mode, and the step/simpleModeStep diverged
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled =
    (step === stepConfigs.length - 1 && !form.hierarchyValid) ||
    isStepValid(step, stepConfigs, form) ||
    !additionalStepCheck(step) ||
    isCalculatingThreshold;

  return (
    <DialogFooter
      formId={formId}
      form={form}
      primaryActionText={
        step === stepConfigs.length - 1
          ? t('in-components:blueprintFormMultistep.buttonCreate')
          : t('in-components:blueprintFormMultistep.buttonNext')
      }
      onSecondaryActionClick={() => backOrCancel(step)}
      secondaryActionText={
        step === 0
          ? t('in-components:blueprintFormMultistep.buttonCancel')
          : t('in-components:blueprintFormMultistep.buttonBack')
      }
      primaryActionDisabled={isDisabled && step !== 0}
      saving={isSaving}
    />
  );
}

function isStepValid(step, stepConfigs, form) {
  const fieldsToValidate = stepConfigs[step].validateIntermediately;
  if (!fieldsToValidate || fieldsToValidate.length === 0) {
    return false;
  }

  let valid = false;
  fieldsToValidate.forEach(fieldPath => {
    try {
      const field = form.getIn(fieldPath);
      if (field && !field.valid) {
        valid = true;
      }
    } catch (ignore) {
      // don't validate if field not present
    }
  });
  return valid;
}
