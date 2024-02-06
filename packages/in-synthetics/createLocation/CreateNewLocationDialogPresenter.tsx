/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { Result, SyntheticDatacenter } from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SelectLocationType from 'in-synthetics/createLocation/steps/SelectLocationType';
import { getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import Configuration from 'in-synthetics/createLocation/steps/Configuration';
import { pendingResult } from 'in-services/fixedObjects';
import { getDatacenters } from 'in-synthetics/api';

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
  const checkLicense: Result<SyntheticDatacenter[]> =
    useObservable<any, []>(() => getDatacenters({}), []) ?? pendingResult;

  // Steps configuration for the dialog
  const stepConfigs = Object.freeze([
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.selectType')
    },
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.configuration')
    }
  ]);

  // Locations Blueprint State
  const [selectedBlueprint, setSelectedBlueprint] = useState(getLocationsBluePrintConfig()[0]);
  const [selectedDatacenter, setSelectedDatacenter] = useState('');

  return (
    <DialogWithSlideInView
      onClose={onClose}
      doNotCloseOnOutsideClick
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
            onCreate={onClose}
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
                      setSelectedDatacenter={setSelectedDatacenter}
                      checkLicense={checkLicense}
                    />
                  );
                case 1:
                  return (
                    <Configuration
                      selectedBlueprint={selectedBlueprint}
                      selectedDatacenter={selectedDatacenter}
                      setSelectedDatacenter={setSelectedDatacenter}
                    />
                  );
                default:
                  return null;
              }
            }}
            customSaveButtonText={
              selectedBlueprint.type == 'managed'
                ? t('in-synthetics:dialog.createLocation.activate')
                : t('in-synthetics:dialog.createLocation.done')
            }
            additionalStepCheck={() => {
              return selectedBlueprint.type === 'managed' &&
                !checkLicense.progress.loading &&
                checkLicense.errors.length !== 0
                ? false
                : true;
            }}
          />
        </div>
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateNewLocationDialogPresenter;
