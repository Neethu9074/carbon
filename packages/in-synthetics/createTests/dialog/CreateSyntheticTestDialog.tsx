/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';
import { isEmpty } from 'lodash';

import CreateSyntheticTestDialogPresenter from 'in-synthetics/createTests/dialog/CreateSyntheticTestDialogPresenter';
import { showCreateSuccessMessage, showCreateErrorMessage } from 'in-synthetics/createTests/utils/userFeedback';
import { Code, SlideInConfig, SliderState, TestTypeSelected } from 'in-synthetics/utils/constants';
import { CtaTrackingFunction, useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import { syntheticWizardCreateButtonClick } from 'in-synthetics/tracking/tracker';
import { Error as ScriptError, SyntheticTest } from 'in-types';
import { createTest } from 'in-synthetics/api';

interface CreateSyntheticTestDialogProps {
  onClose: () => void;
}

const CreateSyntheticTestDialog = ({ onClose }: CreateSyntheticTestDialogProps) => {
  const { trackCta } = useSegmentTracking();
  const selectedBlueprint = getSimpleBlueprintConfig()[0];
  const [form, updateForm] = useState(() => {
    return createForm(true, selectedBlueprint);
  });
  const [isSaving, setIsSaving] = useState(false);
  const [scriptErrors, setScriptErrors] = useState([] as ScriptError[]);
  const [scriptDetails, setScriptDetails] = useState<Code>({ modified: false, name: '' });
  const [simpleMode, setSimpleMode] = useState(true);
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideConfig, setSlideConfig] = useState<SlideInConfig | null>(null);
  const [testTypeSelected, setTestTypeSelected] = useState<TestTypeSelected>({
    api: { simple: false, script: false },
    browser: { simple: false, script: false },
    ssl: { simple: false }
  });
  const [renderSectionsCounter, setRenderSectionsCounter] = useState(0);
  const formId = 'create-synthetics-test-form';

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  const handleOnSaveSuccess = () => {
    showCreateSuccessMessage();
    onClose();
  };

  const handleCreateTest = () => {
    createSyntheticTest(form, setIsSaving, simpleMode, handleOnSaveSuccess, onClose, trackCta);
  };

  return (
    <CreateSyntheticTestDialogPresenter
      onClose={onClose}
      simpleMode={simpleMode}
      setSimpleMode={setSimpleMode}
      form={form}
      formId={formId}
      onCreate={handleCreateTest}
      updateForm={updateForm}
      scriptErrors={scriptErrors}
      setScriptErrors={setScriptErrors}
      scriptDetails={scriptDetails}
      setScriptDetails={setScriptDetails}
      isSaving={isSaving}
      slideInViewVisible={slideInViewVisible}
      setSlideInViewVisible={setSlideInViewVisible}
      slideInConfig={slideConfig}
      setSliderState={setSliderState}
      testTypeSelected={testTypeSelected}
      setTestTypeSelected={setTestTypeSelected}
      renderSectionsCounter={renderSectionsCounter}
      setRenderSectionsCounter={setRenderSectionsCounter}
    />
  );
};

const createSyntheticTest = (
  form: MapForm<any>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  simpleMode: boolean,
  handleOnSaveSuccess: () => void,
  onClose: () => void,
  trackCta: CtaTrackingFunction
) => {
  setIsSaving(true);

  let testConfig: SyntheticTest;
  let updatedForm: MapForm<any>;
  if (simpleMode) {
    syntheticWizardCreateButtonClick(trackCta);
    testConfig = {
      active: true,
      ...form.toJS()
    } as SyntheticTest;
  } else {
    if (
      form.get('configuration').get('syntheticType').value === 'HTTPAction' &&
      isEmpty(form.get('configuration').get('headers').value)
    ) {
      updatedForm = form.put('configuration', form.get('configuration').remove('headers'));
      testConfig = {
        active: true,
        ...updatedForm.toJS()
      } as SyntheticTest;
    } else {
      testConfig = {
        active: true,
        ...form.toJS()
      } as SyntheticTest;
    }
  }
  const result$ = createTest(testConfig);

  result$.once(
    _result => {
      handleOnSaveSuccess();
    },
    error => {
      setIsSaving(false);
      showCreateErrorMessage(deserializeErrorMessage(error.message));
      onClose();
    }
  );
};

export default CreateSyntheticTestDialog;
