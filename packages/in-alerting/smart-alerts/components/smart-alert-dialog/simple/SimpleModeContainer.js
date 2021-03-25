/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import SimpleModePageNavigation from 'in-new-components/BlueprintFormMultistep/SimpleModePageNavigation';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/simple/SimpleModeContainer.mless';

export default function SimpleModeContainer(props) {
  const {
    form,
    onClose,
    onCreate,
    setSimpleModeStep,
    updateForm,
    stepConfigs,
    onStepChanged,
    stepRenderers,
    isTagFilterFormModelValid,
    isSaving
  } = props;

  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        onClose={onClose}
        onCreate={onCreate}
        setSimpleModeStep={setSimpleModeStep}
        updateForm={updateForm}
        stepConfigs={stepConfigs}
        isSaving={isSaving}
        onStepChanged={onStepChanged}
        renderStep={step => stepRenderers[step](props)}
        additionalStepCheck={step => {
          return step === 1 ? true : isTagFilterFormModelValid;
        }}
      />
    </div>
  );
}

SimpleModeContainer.propTypes = {
  form: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  onStepChanged: PropTypes.func.isRequired,
  setSimpleModeStep: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired,
  stepConfigs: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      validateIntermediately: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))
    })
  ).isRequired,
  stepRenderers: PropTypes.arrayOf(PropTypes.func).isRequired,
  isTagFilterFormModelValid: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool
};
