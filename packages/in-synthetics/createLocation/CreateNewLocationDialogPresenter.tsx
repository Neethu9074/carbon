/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { useObservable } from '@instana/hooks';
import { Result } from '@instana/types';
import { t } from '@instana/i18n-react';

import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import SelectLocationType from 'in-synthetics/createLocation/steps/SelectLocationType';
import ConfirmationDialog from 'in-synthetics/createLocation/steps/ConfirmationDialog';
import { getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import ConfigurationStep from 'in-synthetics/createLocation/steps/ConfigurationStep';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { noop, pendingResult } from 'in-services/fixedObjects';
import { getDatacenterLicense } from 'in-synthetics/api';

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
  const checkLicense: Result<string> = useObservable<any, []>(() => getDatacenterLicense(), []) ?? pendingResult;

  // Steps configuration for the dialog
  const stepConfigs = [
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.selectType')
    },
    {
      title: t('in-synthetics:dialog.createLocation.stepConfigs.configuration')
    }
  ];

  // Locations Blueprint State
  const [selectedBlueprint, setSelectedBlueprint] = useState(getLocationsBluePrintConfig()[0]);

  const onSubmit = () => {
    onClose();
    addActiveDialog(
      <ConfirmationDialog
        header={t('in-synthetics:dialog.createLocation.newLocation')}
        headerIcon="lib_synthetic_location"
        buttonLabel={t('in-synthetics:dialog.createLocation.done')}
        buttonKind="primary"
        onSubmit={() => onClose()}
        form={form}
      />
    );
  };

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
            onCreate={selectedBlueprint.type === 'private' ? onClose : () => onSubmit()}
            simpleModeStep={simpleModeStep}
            setSimpleModeStep={setSimpleModeStep}
            stepConfigs={stepConfigs}
            renderStep={(step: number) => {
              switch (step) {
                case 0:
                  return (
                    <SelectLocationType
                      selectedBlueprint={selectedBlueprint}
                      setSelectedBlueprint={setSelectedBlueprint}
                      updateForm={updateForm}
                      checkLicense={checkLicense}
                    />
                  );
                case 1:
                  return (
                    <ConfigurationStep selectedBlueprint={selectedBlueprint} form={form} updateForm={updateForm} />
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
            additionalStepCheck={(step: number) => {
              return step === 0 &&
                selectedBlueprint.type === 'managed' &&
                !checkLicense.progress.loading &&
                checkLicense.errors.length !== 0
                ? false
                : true;
            }}
            onStepChanged={noop}
            noStepCheckOnFirstStep
          />
        </div>
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateNewLocationDialogPresenter;
