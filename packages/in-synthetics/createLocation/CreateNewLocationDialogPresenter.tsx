/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { t } from '@instana/i18n-react';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SelectLocationType from 'in-synthetics/createLocation/steps/SelectLocationType';
import { getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import Configuration from 'in-synthetics/createLocation/steps/Configuration';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

interface Props {
  onClose: () => void;
  formId: string;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  simpleModeStep: number;
  setSimpleModeStep: React.Dispatch<React.SetStateAction<number>>;
}

const CreateNewLocationDialogPresenter = ({
  onClose,
  formId,
  form,
  updateForm,
  simpleModeStep,
  setSimpleModeStep
}: Props) => {
  // Steps configuration for the dialog
  const stepConfigs = Object.freeze([
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.selectType')
    },
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.selectType')
    }
  ]);

  // Locations Blueprint State
  const [selectedBlueprint, setSelectedBlueprint] = useState(getLocationsBluePrintConfig()[0]);

  return (
    <DialogWithSlideInView
      onClose={onClose}
      title={t('in-synthetics:dialog.createLocation.newLocation')}
      titleIconType="lib_synthetic_location"
    >
      <div className={locals.simpleDialog}>
        <div className={locals.container}>
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
                  return (
                    <SelectLocationType
                      selectedBlueprint={selectedBlueprint}
                      setSelectedBlueprint={setSelectedBlueprint}
                      updateForm={updateForm}
                    />
                  );
                case 1:
                  return <Configuration />;
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

export default CreateNewLocationDialogPresenter;
