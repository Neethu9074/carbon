/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createField, createMapForm } from 'formalistic';
import React, { useState } from 'react';

import { Button } from '@instana/components';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { composeAndShortCircuitOnError } from 'in-services/validators/compose';
import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import { notUndefinedValidator } from 'in-services/validators/undefined';

const NewLocationButton = () => {
  const handleClick = () => {
    addActiveDialog(<CreateNewLocationDialog onClose={close} />);
  };
  return (
    <Button onClick={handleClick} kind="info" icon="lib_synthetic_location">
      New Location
    </Button>
  );
};

// ---------------------------------------------------
const CreateNewLocationDialog = ({ onClose }: any) => {
  // Create form-id
  const formId = 'new-location-form';
  // Create a form
  const [form, updateForm] = useState(() => createNewLocationForm());
  const [simpleModeStep, setSimpleModeStep] = useState(0);

  return (
    <CreateNewLocationDialogPresenter
      onClose={onClose}
      formId={formId}
      form={form}
      updateForm={updateForm}
      simpleModeStep={simpleModeStep}
      setSimpleModeStep={setSimpleModeStep}
    />
  );
};

// ---------------------------------------------------
const CreateNewLocationDialogPresenter = ({
  onClose,
  formId,
  form,
  updateForm,
  simpleModeStep,
  setSimpleModeStep
}: any) => {
  // Steps
  const stepConfigs = Object.freeze([
    {
      title: 'Step 1: Select type'
    },
    {
      title: 'Step 2: Configuration'
    }
  ]);

  return (
    <DialogWithSlideInView onClose={onClose} title={'New Location'} titleIconType="lib_synthetic_location">
      <div>
        <div>
          <SimpleModePageNavigation
            onClose={onClose}
            formId={formId}
            form={form}
            updateForm={updateForm}
            onCreate={() => {}}
            simpleModeStep={simpleModeStep}
            setSimpleModeStep={setSimpleModeStep}
            stepConfigs={stepConfigs}
            onStepChanged={() => {}}
            renderStep={(step: number) => {
              switch (step) {
                case 0:
                  return <h1>Step 1 for New Location</h1>;
                case 1:
                  return <h1>Step 2 for New Location</h1>;
                default:
                  return null;
              }
            }}
          />
        </div>
      </div>
    </DialogWithSlideInView>
  );
};

// ------------- Create form for New Location -------------------
const createNewLocationForm = () => {
  return createMapForm({ validator: notUndefinedValidator }).put(
    'location',
    createField({
      value: '',
      validator: composeAndShortCircuitOnError(notUndefinedValidator)
    })
  );
};

export default NewLocationButton;
