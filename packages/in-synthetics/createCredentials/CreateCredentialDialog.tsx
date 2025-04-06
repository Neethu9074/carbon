/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { Field } from 'formalistic';

import { Spacer, Typography } from '@instana/components';

import { showCreateErrorMessage, showCreateSuccessMessage } from 'in-synthetics/createTests/utils/userFeedback';
import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import createCredentialForm from 'in-synthetics/createCredentials/createCredentialForm';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { syntheticCreateCredentialButtonClick } from 'in-synthetics/tracking/tracker';
import deserializeErrorMessage from 'in-synthetics/utils/deserializeErrorMessage';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SlideInConfig, SliderState } from 'in-synthetics/utils/constants';
import StepOne from 'in-synthetics/createCredentials/steps/StepOne';
import StepTwo from 'in-synthetics/createCredentials/steps/StepTwo';
import { createCredential } from 'in-synthetics/api';
import { noop } from 'in-services/fixedObjects';
import { SyntheticCredential } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createCredentials/CreateCredentials.mless';

interface Props {
  credentialNames: string[];
  onClose: () => void;
}

const CreateCredentialDialog = ({ credentialNames, onClose }: Props) => {
  const formId = 'new-credential-form';
  const [step, setStep] = useState(0);
  const [form, updateForm] = useState(() => createCredentialForm(credentialNames));
  const [slideInViewVisible, setSlideInViewVisible] = useState(false);
  const [slideInConfig, setSlideConfig] = useState<SlideInConfig | null>(null);
  const { trackCta } = useSegmentTracking();

  const credentialNameField = form.get('credentialName') as Field<string>;
  const credentialValueField = form.get('credentialValue') as Field<string>;

  const setSliderState = ({ slideInConfig, isVisible }: SliderState) => {
    if (slideInConfig) {
      setSlideConfig(slideInConfig);
    }
    setSlideInViewVisible(isVisible);
  };

  const stepConfigs = [
    { title: t('in-synthetics:dialog.createCredential.nameValue') },
    { title: t('in-synthetics:dialog.createCredential.associations') }
  ];

  const onCreate = () => {
    syntheticCreateCredentialButtonClick(trackCta);
    let credentialConfig: SyntheticCredential;

    credentialConfig = {
      credentialName: '',
      credentialValue: '',
      ...form.toJS()
    } as SyntheticCredential;

    const result$ = createCredential(credentialConfig);

    result$.once(
      _result => {
        showCreateSuccessMessage('credential');
        onClose();
        window.location.reload();
      },
      error => {
        showCreateErrorMessage(deserializeErrorMessage(error.message), 'credential');
        onClose();
      }
    );
  };

  return (
    <DialogWithSlideInView
      title={<Typography variant="heading-400">{t('in-synthetics:dialog.createCredential.newCredentials')}</Typography>}
      onClose={onClose}
      doNotCloseOnOutsideClick
      titleIconType="lib_synthetic_credential"
      slideInViewVisible={slideInViewVisible}
      slideInViewComponent={slideInConfig?.component}
      slideInViewTitle={slideInConfig?.title}
      onSlideInViewTitleClick={() => setSlideInViewVisible(!slideInViewVisible)}
    >
      <LeftRightPadding className={locals.dialog}>
        <SimpleModePageNavigation
          form={form}
          formId={formId}
          onClose={onClose}
          updateForm={updateForm}
          onCreate={onCreate}
          stepConfigs={stepConfigs}
          simpleModeStep={step}
          setSimpleModeStep={setStep}
          renderStep={step => {
            switch (step) {
              case 0:
                return (
                  <SimpleModeStepContentWrapper headline={t('in-synthetics:dialog.createCredential.nameValue')}>
                    <StepOne form={form} updateForm={updateForm} />
                  </SimpleModeStepContentWrapper>
                );
              case 1:
                return (
                  <SimpleModeStepContentWrapper headline={t('in-synthetics:dialog.createCredential.associations')}>
                    <StepTwo form={form} updateForm={updateForm} setSliderState={setSliderState} />
                  </SimpleModeStepContentWrapper>
                );
              default:
                return null;
            }
          }}
          onStepChanged={noop}
          additionalStepCheck={(step: number) => {
            return !(step === 0 && (!credentialNameField.valid || !credentialValueField.valid));
          }}
          noStepCheckOnFirstStep
        />
      </LeftRightPadding>
      <Spacer vertical="large" />
    </DialogWithSlideInView>
  );
};

export default CreateCredentialDialog;
