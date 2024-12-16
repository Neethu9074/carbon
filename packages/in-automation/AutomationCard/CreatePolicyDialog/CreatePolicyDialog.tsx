/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Action, Error, Event, Result } from '@instana/types';
import { Typography } from '@instana/components';

import usePolicyForm, { PolicyForm } from 'in-automation/AutomationCard/CreatePolicyDialog/usePolicyForm';
import CreatePolicyStep from 'in-automation/AutomationCard/CreatePolicyDialog/Steps/CreatePolicyStep';
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import ViewActionStep from 'in-automation/AutomationCard/CreatePolicyDialog/Steps/ViewActionStep';
import { setActiveKey } from 'in-automation/AutomationCard/AutomationCardButtonGroup';
import LeftRightPadding from 'in-components/layout/LeftRightPadding/LeftRightPadding';
import { StepConfigs } from 'in-components/BlueprintFormMultistep/StepConfigs';
import DialogWithSlideInView from 'in-components/Dialog/DialogWithSlideInView';
import { useSegmentTracker, TrackingFunction } from 'in-automation/tracker';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { refresh } from 'in-automation/AutomationCard/usePolicies';
import { hasError, isLoading } from 'in-services/util/result';
import { isAIActionCopy } from 'in-automation/utils/action';
import { close } from 'in-components/DialogPresenter/store';
import { TriggerSpecification } from 'in-automation/types';
import { saveNewPolicy } from 'in-automation/api';
import { noop } from 'in-services/fixedObjects';
import { Trans, t } from 'in-i18n';

import locals from './CreatePolicyDialog.mless';

const stepConfigs: StepConfigs = [
  {
    title: t('in-automation:CreatePolicyDialog.step1Title')
  },
  {
    title: t('in-automation:CreatePolicyDialog.step2Title')
  }
];

interface CreatePolicyDialogProps {
  event: Event;
  action: Action;
  trigger: Result<TriggerSpecification>;
}

export default function CreatePolicyDialog({ action, event, trigger }: CreatePolicyDialogProps) {
  const [step, setStep] = useState(0);

  const [form, setForm] = usePolicyForm();
  const { createPolicyTrackerSegment } = useSegmentTracker();

  const onCreate = () => {
    createPolicy({ form, event, action, createPolicyTrackerSegment });
  };

  return (
    <DialogWithSlideInView
      title={<Typography variant="heading-400">{t('in-automation:viewActionCreatePolicy')}</Typography>}
      onClose={close}
      titleIconType="lib_openclose_add_circle_outline"
      doNotCloseOnOutsideClick
    >
      <LeftRightPadding className={locals.dialog}>
        <SimpleModePageNavigation
          form={form}
          formId="createPolicyForm"
          onClose={close}
          onCreate={onCreate}
          updateForm={setForm}
          simpleModeStep={step}
          setSimpleModeStep={setStep}
          renderStep={step => {
            switch (step) {
              case 0:
                return <ViewActionStep action={action} />;
              case 1:
                return <CreatePolicyStep form={form} setForm={setForm} trigger={trigger} action={action} />;
              default:
                return null;
            }
          }}
          stepConfigs={stepConfigs}
          onStepChanged={noop}
          noStepCheckOnFirstStep
        />
      </LeftRightPadding>
    </DialogWithSlideInView>
  );
}

function createPolicy({
  form,
  event,
  action,
  createPolicyTrackerSegment
}: {
  event: Event;
  action: Action;
  form: PolicyForm;
  createPolicyTrackerSegment: TrackingFunction;
}) {
  const policy = createBasePolicy(event, action, {
    name: form.get('name').value,
    description: form.get('description').value,
    tags: form.get('tags').value
  });

  saveNewPolicy(policy)
    .filter(res => !isLoading(res))
    .once(
      result => {
        if (hasError(result)) {
          onCreateFailed(result.errors);
        }
        createPolicyTrackerSegment({
          actionName: action.name,
          actionType: action.type,
          policyName: policy.name,
          policyType: 'manual',
          aiOriginated: isAIActionCopy(action!) ? true : false,
          triggerName: event.problem?.problemText
        });
        refresh();
        setActiveKey('automationPolicies');
        onCreateSuccess(policy.name);
      },
      () => {
        onCreateFailed([{ code: 'SERVER', message: 'Failed to create policy.' }]);
      }
    );
}

// TODO: update content to have link to created policy
function onCreateSuccess(name: string) {
  addMessage({
    type: 'info',
    timeout: 5000,
    title: t('in-automation:CreatePolicyDialog.policy.success.title'),
    content: <Trans i18nKey="in-automation:CreatePolicyDialog.policy.success.content" values={{ name: name }} />
  });
  close();
}

// TODO: show error in the dialog
function onCreateFailed(errors: Error[]) {
  errors.forEach(error =>
    addMessage({
      type: 'danger',
      timeout: 3000,
      title: t('in-automation:policies.createDialog.failure.title'),
      content: (
        <Trans i18nKey="in-automation:policies.createDialog.failure.content" values={{ errorMessage: error.message }} />
      )
    })
  );
  close();
}
