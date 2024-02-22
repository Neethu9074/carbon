/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { MapForm } from 'formalistic';

import { useObservable } from '@instana/hooks';
import { createLogger } from '@instana/logger';
import { Result } from '@instana/types';
import { t } from '@instana/i18n-react';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import getSyntheticDatacenterDeployment from 'in-synthetics/subscriptions/getSyntheticDatacenterDeployment';
import SelectLocationType from 'in-synthetics/createLocation/steps/SelectLocationType';
import ConfirmationDialog from 'in-synthetics/createLocation/steps/ConfirmationDialog';
import { getLocationsBluePrintConfig } from 'in-synthetics/createLocation/bluePrints';
import ConfigurationStep from 'in-synthetics/createLocation/steps/ConfigurationStep';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { getDatacenterLicense } from 'in-synthetics/api';
import { pendingResult } from 'in-services/fixedObjects';

import locals from 'in-synthetics/createLocation/NewLocationStyles.mless';

const logger = createLogger('in-synthetics/createLocation/CreateNewLocationDialogPresenter');

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

  const onSubmit = () => {
    getSyntheticDatacenterDeployment({
      deploymentAction: 'activate',
      syntheticDatacenters: form.get('syntheticDatacenters').value
    }).once(
      () => {
        // action on success
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
      },
      error => {
        onClose();
        logger.error(`failed to activate datacenters : ${deserializeErrorMessage(error.message)}`, error);
      }
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
            onCreate={selectedBlueprint.type === 'private' ? onClose : onSubmit}
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
            additionalStepCheck={() => {
              return selectedBlueprint.type === 'managed' &&
                !checkLicense.progress.loading &&
                checkLicense.errors.length !== 0
                ? false
                : true;
            }}
            onStepChanged={() => {}}
          />
        </div>
      </div>
    </DialogWithSlideInView>
  );
};

export default CreateNewLocationDialogPresenter;
