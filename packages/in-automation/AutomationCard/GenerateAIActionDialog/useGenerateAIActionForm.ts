/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field as FormField, MapForm, createField, createMapForm, notBlankValidator } from 'formalistic';
import { useState } from 'react';

import { ActionType, Event, Field, Result } from '@instana/types';

import { NewAction, createManualField, createScriptFields } from 'in-automation/api';
import { isManual, isScript } from 'in-automation/ActionCatalog/shared';
import { TriggerSpecification } from 'in-automation/Policies/types';
import { getPluginName } from 'in-sdk/pluginName';

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
  if (isManual(type)) {
    const content = actionForm.get('content').value;
    fields.push(createManualField(content));
  }
  if (isScript(type)) {
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
    metadata: { readOnly: false, builtIn: false, sensorImported: false, aiOriginated: true }
  };
}

const defaultActionTags = ['watsonx'];
const defaultActionType: ActionType = 'MANUAL';

interface UseGenerateAIActionFormParams {
  trigger: Result<TriggerSpecification>;
  event: Event;
}

function createGenerateAIActionForm({ trigger, event }: UseGenerateAIActionFormParams) {
  const { name = '', description = '' } = trigger.data!;
  const defaultActionName = `AI generated action for ${name}`;
  const defaultActionDescription = `This resolves event with ${description}`;
  const entityType = getPluginName(event.plugin) ?? '';

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
          })
        },
        validator: form => {
          const type = form.type.value;
          if (isManual(type)) {
            return notBlankValidator(form.content.value);
          }
          if (isScript(type)) {
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

export default function useGenerateAIActionForm({ trigger, event }: UseGenerateAIActionFormParams) {
  return useState(createGenerateAIActionForm({ trigger, event }));
}
