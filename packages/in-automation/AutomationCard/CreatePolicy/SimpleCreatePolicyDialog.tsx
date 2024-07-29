/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, notBlankValidator, createMapForm, createField, Field as FormField } from 'formalistic';
import React, { useState } from 'react';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { CreatePolicyStep } from 'in-automation/AutomationCard/CreatePolicy/CreatePolicyStep';
import ViewActionStep from 'in-automation/AutomationCard/CreatePolicy/ViewActionStep';
import { createPolicyFromRecommendedActionsTracker } from 'in-automation/tracker';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { refresh } from 'in-automation/AutomationCard/usePolicies';
import { close } from 'in-components/DialogPresenter/store';
import { saveNewPolicy } from 'in-automation/api';
import { ScoredAction } from 'in-automation/api';
import { noop } from 'in-services/fixedObjects';
import { Event, Error } from 'in-types';
import { Trans, t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAIDialog/SelectAIActionsDialogPresenter.mless';

export type setSelectedAIAction = (action: ScoredAction) => void;

type PolicyFormItems = {
  name: FormField<string>;
  policyName: FormField<string>;
  policyDescription: FormField<string>;
  policyTags: FormField<string[]>;
};

export type PolicyForm = MapForm<PolicyFormItems>;

interface SimpleAIDialogProps {
  event: Event;
  setActiveKey: SetActiveKey;
  selectedAction: ScoredAction;
}

export default function SimpleCreatePolicyDialog({ selectedAction, event, setActiveKey }: SimpleAIDialogProps) {
  const [simpleModeStep, setSimpleModeStep] = useState(0);
  const [form, updateForm] = useState(createNewPolicyFormDefinition(selectedAction));

  const handleCreatePolicy = () => {
    createPolicy({ form, event, selectedAction, setActiveKey });
  };
  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        formId="createPolicyForm"
        onClose={close}
        onCreate={handleCreatePolicy}
        updateForm={updateForm}
        simpleModeStep={simpleModeStep}
        setSimpleModeStep={setSimpleModeStep}
        renderStep={(step: number) => {
          switch (step) {
            case 0:
              return <ViewActionStep selectedAction={selectedAction} />;
            case 1:
              return <CreatePolicyStep form={form} event={event} updateForm={updateForm} />;
            default:
              return null;
          }
        }}
        stepConfigs={stepConfigs}
        onStepChanged={noop}
        noStepCheckOnFirstStep
      />
    </div>
  );
}
type handleCreatePolicyProps = SimpleAIDialogProps & { form: PolicyForm };
const createPolicy = ({ form, event, selectedAction, setActiveKey }: handleCreatePolicyProps) => {
  const policyDetails = {
    name: form.get('policyName').value,
    description: form.get('policyDescription').value,
    tags: form.get('policyTags').value
  };
  const policy = createBasePolicy(event, selectedAction, policyDetails);

  saveNewPolicy(policy).once(
    () => {
      createPolicyFromRecommendedActionsTracker({
        name: policy.name,
        triggerName: event.problem?.problemText,
        actionName: selectedAction.name,
        type: 'manual'
      });
      refresh();
      setActiveKey('automationPolicies');
      onCreateSuccess(policy.name);
    },
    error => {
      onCreateFailed(error);
    }
  );
};

const stepConfigs = Object.freeze([
  {
    title: t('in-automation:SimpleCreatePolicyDialog.step1Title')
  },
  {
    title: t('in-automation:SimpleCreatePolicyDialog.step2Title')
  }
]);

export function createNewPolicyFormDefinition(action: ScoredAction) {
  const form: PolicyForm = createMapForm({
    items: {
      name: createField({
        value: action.name,
        validator: notBlankValidator
      }),
      policyName: createField({
        value: '',
        validator: notBlankValidator
      }),
      policyDescription: createField({
        value: action?.description ?? '',
        validator: notBlankValidator
      }),
      policyTags: createField({
        value: [] as string[]
      })
    }
  });
  return form;
}

function onCreateSuccess(name: string) {
  addMessage({
    type: 'info',
    timeout: 5000,
    title: t('in-automation:SimpleCreatePolicyDialog.policy.success.title'),
    content: (
      <Trans
        i18nKey="in-automation:SimpleCreatePolicyDialog.policy.success.successContentForuserAction"
        values={{ name: name }}
      />
    )
  });
  close();
}

function onCreateFailed(error: Error) {
  addMessage(
    {
      type: 'danger',
      timeout: 3000,
      title: t('in-automation:policies.createDialog.failure.title'),
      content: (
        <Trans i18nKey="in-automation:policies.createDialog.failure.content" values={{ errorMessage: error.message }} />
      )
    },
    'policy-fail-error'
  );
  close();
}
