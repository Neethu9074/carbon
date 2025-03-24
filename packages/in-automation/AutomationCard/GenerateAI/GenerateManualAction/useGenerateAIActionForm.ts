/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field as FormField, MapForm, createField, createMapForm, notBlankValidator } from 'formalistic';
import { useState } from 'react';

import { ActionType, Event, Field, Result } from '@instana/types';

import { createManualField, createScriptFields } from 'in-automation/utils/actionField';
import { getTriggerTypeFromEvent } from 'in-automation/AutomationCard/shared';
import { aiOriginatedMetadata } from 'in-automation/utils/action';
import { TriggerSpecification } from 'in-automation/types';
import { ACTION_TYPE } from 'in-automation/constants';
import { hasError } from 'in-services/util/result';
import { getPluginName } from 'in-sdk/pluginName';
import { NewAction } from 'in-automation/types';

type GenerateAIActionFormItems = {
  prompt: MapForm<{
    eventName: FormField<string>;
    eventDescription: FormField<string>;
    eventEntityType: FormField<string>;
  }>;
  action: MapForm<{
    name: FormField<string>;
    description: FormField<string>;
    tags: FormField<string[]>;
    type: FormField<ActionType>;
    content: FormField<string>;
    script: FormField<string>;
    aiGeneratedContent: FormField<string>;
    feedbackState: FormField<string>;
    badFeedback: FormField<string>;
  }>;
  policy: MapForm<{
    name: FormField<string>;
    description: FormField<string>;
    tags: FormField<string[]>;
  }>;
};

export type GenerateAIActionForm = MapForm<GenerateAIActionFormItems>;

export function getActionFromForm(form: GenerateAIActionForm): NewAction {
  const actionForm = form.get('action');
  const name = actionForm.get('name').value;
  const description = actionForm.get('description').value;
  const type = actionForm.get('type').value;
  const tags = actionForm.get('tags').value;
  const fields: Field[] = [];
  if (type === ACTION_TYPE.MANUAL) {
    const content = actionForm.get('content').value;
    fields.push(createManualField(content));
  }
  if (type === ACTION_TYPE.SCRIPT) {
    const value = actionForm.get('script').value;
    fields.push(...createScriptFields({ value, subtype: '', timeout: '' }));
  }
  return {
    name,
    description,
    fields,
    type,
    tags,
    inputParameters: [],
    metadata: aiOriginatedMetadata
  };
}

const defaultActionTags = ['watsonx'];
const defaultActionType: ActionType = 'MANUAL';

interface UseGenerateAIActionFormParams {
  trigger: Result<TriggerSpecification>;
  event: Event;
  selectedDescription?: string | null;
  selectedEntityType?: string | null;
}

function getEventEntity(event: Event): string {
  const triggerType = getTriggerTypeFromEvent(event);
  switch (triggerType) {
    case 'applicationSmartAlert':
      return 'Application';
    case 'websiteSmartAlert':
      return 'Website';
    case 'globalApplicationSmartAlert':
      return 'Application';
    case 'mobileAppSmartAlert':
      return 'Mobile';
    case 'logSmartAlert':
      return 'Logs';
    case 'syntheticsSmartAlert':
      return 'Synthetic test';
    case 'sloSmartAlert':
      return 'Service level objective';
    default:
      return getPluginName(event.plugin) ?? '';
  }
}

function createGenerateAIActionForm({
  trigger,
  event,
  selectedDescription,
  selectedEntityType
}: UseGenerateAIActionFormParams) {
  const name = event?.problem?.problemText ?? '';
  const description =
    selectedDescription && selectedDescription !== null
      ? `Higher than expected error rate going through ${selectedDescription} in ${selectedEntityType} `
      : hasError(trigger)
      ? event?.problem?.fixSuggestion ?? ''
      : trigger.data!?.description ?? '';
  const defaultActionName = `AI generated action for ${name}`;
  const defaultActionDescription = `This resolves event: ${description}`;
  const entityType =
    selectedEntityType && selectedEntityType !== null ? getPluginName(selectedEntityType) ?? '' : getEventEntity(event);

  const form: GenerateAIActionForm = createMapForm({
    items: {
      prompt: createMapForm({
        items: {
          eventName: createField({
            value: name,
            validator: notBlankValidator
          }),
          eventDescription: createField({
            value: description,
            validator: notBlankValidator
          }),
          eventEntityType: createField({
            value: entityType,
            validator: notBlankValidator
          })
        }
      }),
      action: createMapForm({
        items: {
          name: createField({
            value: defaultActionName,
            validator: notBlankValidator
          }),
          description: createField({
            value: defaultActionDescription,
            validator: notBlankValidator
          }),
          tags: createField({
            value: defaultActionTags
          }),
          type: createField({
            value: defaultActionType,
            validator: notBlankValidator
          }),
          script: createField({
            value: ''
          }),
          content: createField({
            value: ''
          }),
          aiGeneratedContent: createField({
            value: ''
          }),
          feedbackState: createField({
            value: ''
          }),
          badFeedback: createField({
            value: ''
          })
        },
        validator: form => {
          const type = form.type.value;
          if (type === ACTION_TYPE.MANUAL) {
            return notBlankValidator(form.content.value);
          }
          if (type === ACTION_TYPE.SCRIPT) {
            return notBlankValidator(form.script.value);
          }
          return null;
        }
      }),
      policy: createMapForm({
        items: {
          name: createField({
            value: '',
            validator: notBlankValidator
          }),
          description: createField({
            value: '',
            validator: notBlankValidator
          }),
          tags: createField<string[]>({
            value: []
          })
        }
      })
    }
  });

  return form;
}

export default function useGenerateAIActionForm({
  trigger,
  event,
  selectedDescription,
  selectedEntityType
}: UseGenerateAIActionFormParams) {
  return useState(createGenerateAIActionForm({ trigger, event, selectedDescription, selectedEntityType }));
}
