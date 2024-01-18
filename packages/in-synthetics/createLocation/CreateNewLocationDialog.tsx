/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import CreateNewLocationDialogPresenter from 'in-synthetics/createLocation/CreateNewLocationDialogPresenter';
import createNewLocationForm from 'in-synthetics/createLocation/createLocationForm';

const CreateNewLocationDialog = ({ onClose }: any) => {
  const formId = 'new-location-form';
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

export default CreateNewLocationDialog;
