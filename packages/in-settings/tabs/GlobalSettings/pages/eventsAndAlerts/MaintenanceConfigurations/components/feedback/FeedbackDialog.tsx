/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';
import React, { FormEvent, useEffect, useState } from 'react';

import { Stack, Typography } from '@instana/components';
import { generateUniqueShortId } from '@instana/utils';

import {
  FeedbackConfigRMWForm,
  saveFeedbackForm
} from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/api';
import { stepConfigs } from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/stepConfig';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper/HorizontalFlexWrapper';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import DialogFooter from 'in-components/BlueprintFormMultistep/DialogFooter';
import { close } from 'in-components/DialogPresenter/store';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/MaintenanceConfigurations/components/feedback/Feedback.mless';

export default function FeedbackDialog({ firstTime }: { firstTime: boolean | Nullish }) {
  const [step, setStep] = useState<string>(firstTime ? 'firstTimeStart_0' : 'start_0');
  const [form, setForm] = useState<MapForm<FeedbackConfigRMWForm>>(createForm());
  const nextStep = () => {
    if (currentStepConfig.lastStep) {
      const stepStr = step.split('_')[0];
      setStep(stepStr + '_end');
    } else {
      const stepNum = parseInt(step.split('_')[1]);
      setStep(step + `_${stepNum + 1}`);
    }
  };
  const [settings, saveSetting] = useSettingsEditor();

  const currentStepConfig = stepConfigs[step];
  const onSubmit = (e: FormEvent | null) => {
    if (e) e.preventDefault();
    if (!form.hierarchyValid) {
      form.setTouched(true, { recurse: true });
      return;
    }
    if (settings && !settings['hasConfiguredRMW']) {
      saveSetting('hasConfiguredRMW', true);
    }
    save(form);
  };

  useEffect(() => {
    if (currentStepConfig.isEnd) {
      onSubmit(null);
      setTimeout(() => close(), 3 * 1000);
    }
    //eslint-disable-next-line
  }, [currentStepConfig, step]);

  const footer = currentStepConfig.hasFooter ? (
    <DialogFooter
      form={form}
      primaryActionText={
        currentStepConfig.lastStep
          ? t('in-settings:maintenanceWindow.feedback.submit')
          : t('in-components:blueprintFormMultistep.buttonNext')
      }
      onPrimaryActionClick={nextStep}
      secondaryActionText={'Skip'}
      onSecondaryActionClick={nextStep}
    />
  ) : null;
  return (
    <form onSubmit={onSubmit}>
      <DialogWithSlideInView
        title={t('in-settings:maintenanceWindow.feedback.shareFeedback')}
        onClose={close}
        footer={footer}
      >
        <div className={locals.dialog}>
          <HorizontalFlexWrapper className={locals.feedbackImageContainer}>
            <img src={currentStepConfig.stepImg} className={locals.feedbackImage} />
          </HorizontalFlexWrapper>

          <Stack gap="medium">
            <Typography variant="heading-500" align={currentStepConfig.titleAlignment} noMargin>
              {currentStepConfig.title}
            </Typography>

            <Typography variant="body-large" align={currentStepConfig.descriptionAlignment}>
              <div className={locals.feedbackDescription}>{currentStepConfig.description}</div>
            </Typography>
            <div className={locals.dialogContent}>
              {currentStepConfig.component({ nextStep: setStep, form, setForm })}
            </div>
          </Stack>
        </div>
      </DialogWithSlideInView>
    </form>
  );
}

function createForm(): MapForm<FeedbackConfigRMWForm> {
  return createMapForm<FeedbackConfigRMWForm>({
    items: {
      id: createField({ value: generateUniqueShortId() }),
      feeling: createField({ value: '' }),
      stepOne: createField({ value: '' }),
      stepTwo: createField({ value: '' }),
      stepThree: createField({ value: '' })
    }
  });
}

function save(form: MapForm<FeedbackConfigRMWForm>) {
  const feeling = form.get('feeling').value;
  const id = form.get('id').value;

  const stepOne = form.get('stepOne').value;
  const stepTwo = form.get('stepTwo').value;
  const stepThree = form.get('stepThree').value;

  return saveFeedbackForm({
    id,
    feeling,
    stepOne,
    stepTwo,
    stepThree
  });
}
