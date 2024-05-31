/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm, notBlankValidator, createMapForm, createField, Field as FormField } from 'formalistic';
import React, { useState } from 'react';
import { isEmpty } from 'lodash';

import { generateUniqueShortId } from '@instana/utils';
import { Link } from '@instana/components';

// @ts-expect-error
import SimpleModePageNavigation from 'in-components/BlueprintFormMultistep/SimpleModePageNavigation';
import { isScript, isManual, isDocLink, getTimeoutFromFields } from 'in-automation/ActionCatalog/shared';
import { createScriptFields, createManualField, saveNewAction, saveNewPolicy } from 'in-automation/api';
import { putScriptField, putManualField } from 'in-automation/ActionCatalog/ActionFormDefinition';
import { CreatePolicyStep } from 'in-automation/AutomationCard/GenerateAIDialog/CreatePolicyStep';
import { CopyActionStep } from 'in-automation/AutomationCard/GenerateAIDialog/CopyActionStep';
import SelectActionStep from 'in-automation/AutomationCard/GenerateAIDialog/SelectActionStep';
import useHrefToActionDetails from 'in-automation/ActionCatalog/useHrefToActionDetails';
import { MappedParameter } from 'in-automation/ActionCatalog/ParametersTable';
import { SetActiveKey } from 'in-automation/AutomationCard/AutomationCard';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { createPolicyFromAIActionTracker } from 'in-automation/tracker';
import { positiveNumberValidator } from 'in-services/validators/number';
import { createBasePolicy } from 'in-automation/AutomationCard/shared';
import { refresh } from 'in-automation/AutomationCard/usePolicies';
import { Result, Event, Field, Error, Action } from 'in-types';
import { Tag } from 'in-automation/ActionCatalog/TagsTable';
import { close } from 'in-components/DialogPresenter/store';
import { ScoredAction } from 'in-automation/api';
import { noop } from 'in-services/fixedObjects';
import { Trans, t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAIDialog/SelectAIActionsDialogPresenter.mless';

export type setSelectedAIAction = (action: ScoredAction) => void;

type AIActionFormItems = {
  name: FormField<string>;
  description: FormField<string>;
  type: FormField<string>;
  manualContent?: FormField<string>;
  script?: FormField<string>;
  subtype?: FormField<string>;
  timeout: FormField<string>;
  parameters: FormField<MappedParameter[]>;
  tags: FormField<Tag[]>;
  policyName: FormField<string>;
  policyDescription: FormField<string>;
  policyTags: FormField<Tag[]>;
};

export type AIActionForm = MapForm<AIActionFormItems>;

interface SimpleAIDialogProps {
  aiRecommendedScoredActions: Result<ScoredAction[]>;
  event: Event;
  setActiveKey: SetActiveKey;
  selectedAIAction: ScoredAction | null;
  setSelectedAIAction: setSelectedAIAction;
}

export default function SimpleAIDialog({
  aiRecommendedScoredActions,
  event,
  setActiveKey,
  selectedAIAction,
  setSelectedAIAction
}: SimpleAIDialogProps) {
  const [simpleModeStep, setSimpleModeStep] = useState(0);
  const [actionError, setActionError] = useState('');
  const [form, updateForm] = useState(() => {
    return createNewAIActionFormDefinition(selectedAIAction);
  });

  const handleCreatePolicy = () => {
    const action = getActionSpecification(form);
    saveNewAction(action).once(
      res => {
        const policyDetails = {
          name: form.get('policyName').value,
          description: form.get('policyDescription').value,
          tags: form.get('policyTags').value.map(tag => tag.value)
        };
        const policy = createBasePolicy(event, res, policyDetails);

        saveNewPolicy(policy).once(
          () => {
            createPolicyFromAIActionTracker({
              name: policy.name,
              triggerName: event.problem?.problemText,
              actionName: action.name,
              type: 'manual'
            });
            refresh();
            setActiveKey('automationPolicies');
            onCreateSuccess(policy.name, res.id);
          },
          error => {
            onCreateFailed(error);
          }
        );
      },
      actionErrors => {
        if (
          actionErrors.name === 'HttpResponseStatusCodeError' &&
          actionErrors.response &&
          actionErrors.response.body.errors[0]
        ) {
          setActionError(actionErrors.response.body.errors[0]);
        }
      }
    );
  };
  return (
    <div className={locals.container}>
      <SimpleModePageNavigation
        form={form}
        formId="createPolicyAIForm"
        onClose={close}
        onCreate={handleCreatePolicy}
        updateForm={updateForm}
        simpleModeStep={simpleModeStep}
        setSimpleModeStep={setSimpleModeStep}
        renderStep={(step: number) => {
          switch (step) {
            case 0:
              return (
                <SelectActionStep
                  actions={aiRecommendedScoredActions}
                  selectedAIAction={selectedAIAction}
                  setSelectedAIAction={setSelectedAIAction}
                  updateForm={updateForm}
                />
              );
            case 1:
              return (
                <CopyActionStep
                  selectedAIAction={selectedAIAction}
                  actionError={actionError}
                  form={form}
                  updateForm={updateForm}
                />
              );
            case 2:
              return <CreatePolicyStep actionError={actionError} form={form} event={event} updateForm={updateForm} />;
            default:
              return null;
          }
        }}
        stepConfigs={stepConfigs}
        additionalStepCheck={(step: number) => {
          return step >= 0 ? isStepDisabled(step, form, selectedAIAction) : true;
        }}
        onStepChanged={noop}
        noStepCheckOnFirstStep
      />
    </div>
  );
}

const stepConfigs = Object.freeze([
  {
    title: t('in-automation:simpleAIDialog.step1Title')
  },
  {
    title: t('in-automation:simpleAIDialog.step2Title')
  },
  {
    title: t('in-automation:simpleAIDialog.step3Title')
  }
]);

export function createNewAIActionFormDefinition(action: ScoredAction | null) {
  const parameters = action?.inputParameters ?? [];
  const mappedParams = parameters.map(parameter => ({ id: generateUniqueShortId(), value: parameter }));
  const timeout = action?.fields ? getTimeoutFromFields(action.fields).value : '';
  const tags = action?.tags ?? [];
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));
  const policyTags = ([] as string[]).map(tag => ({ value: tag, id: generateUniqueShortId() })) ?? [];
  let form: AIActionForm = createMapForm({
    items: {
      name: createField({
        value: action?.name !== null ? `Copy of(${action?.name})_${generateUniqueShortId()}` : 'New Action',
        validator: notBlankValidator
      }),
      description: createField({
        value: action?.description ?? '',
        validator: notBlankValidator
      }),
      type: createField({
        value: action?.type ?? '',
        validator: notBlankValidator
      }),
      parameters: createField({
        value: mappedParams
      }),
      timeout: createField({
        value: timeout,
        validator: val => {
          if (val === '') return null;
          return positiveNumberValidator(val);
        }
      }),
      tags: createField({
        value: mappedTags,
        validator: tags => {
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag.value === '', false);
          if (hasBlankTags) {
            return [
              {
                severity: 'error',
                message: t('in-automation:theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
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
        value: policyTags,
        validator: tags => {
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag.value === '', false);
          if (hasBlankTags) {
            return [
              {
                severity: 'error',
                message: t('in-automation:theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
      })
    }
  });

  if (action?.type && isScript(action.type)) form = putScriptField(form, action);
  if (action?.type && isManual(action.type)) form = putManualField(form, action);
  return form;
}

function SuccessContent({ name, actionId }: { name: string; actionId: string }) {
  const hrefToActionDetails = useHrefToActionDetails();

  return (
    <div>
      <p>
        <Trans
          i18nKey={'in-automation:simpleAIDialog.policy.success.content'}
          values={{
            name: name
          }}
        />
      </p>

      <Link external href={hrefToActionDetails({ id: actionId } as Action)}>
        {t('in-automation:simpleAIDialog.policy.success.link')}
      </Link>
    </div>
  );
}

function onCreateSuccess(name: string, actionId: string) {
  addMessage({
    type: 'info',
    timeout: 5000,
    title: t('in-automation:simpleAIDialog.policy.success.title'),
    content: <SuccessContent name={name} actionId={actionId} />
  });
  close();
}
function getActionSpecification(form: AIActionForm) {
  const name = form.get('name').value;
  const description = form.get('description').value;
  const type = form.get('type').value;
  const parameters = form.get('parameters').value;
  const timeout = form.get('timeout').value;
  const tags = form.get('tags').value;
  const fields: Field[] = [];
  if (isManual(type)) {
    const content = form.get('manualContent')?.value ?? '';
    fields.push(createManualField(content));
  } else if (isScript(type)) {
    const value = form.get('script')?.value ?? '';
    const subtype = form.get('subtype')?.value ?? '';
    fields.push(...createScriptFields({ value, subtype, timeout }));
  }
  const inputParameters = isDocLink(type) ? [] : parameters.map(parameter => parameter.value);
  return {
    name,
    description,
    fields,
    type,
    tags: tags.map(tag => tag.value),
    inputParameters
  };
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

const isStepDisabled = (step: number, form: AIActionForm, selectedAIAction: ScoredAction | null) => {
  const name = form.get('name').value;
  const description = form.get('description').value;
  const type = form.get('type').value;
  const content = form.get('manualContent')?.value;
  const script = form.get('script')?.value;

  if (step === 0) return selectedAIAction !== null;
  if (step === 1) {
    return (
      !(isEmpty(name) || isEmpty(description) || isEmpty(type)) &&
      !(isManual(type) && isEmpty(content)) &&
      !(isScript(type) && isEmpty(script))
    );
  }
  return true;
};
