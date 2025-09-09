/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Field as FormField,
  MapForm,
  createField,
  createMapForm,
  notBlankValidator,
  ValidationResult,
  Severity
} from 'formalistic';
import { useState } from 'react';

import { ActionType, Field, GeneratedActionInterpreter } from '@instana/types';

import { createScriptFields, createGitUrlFields } from 'in-automation/utils/actionField';
import { Option } from 'in-components/ComboBox/ComboBox';
import { ACTION_TYPE } from 'in-automation/constants';
import { NewAction } from 'in-automation/types';
import { t } from 'in-i18n';

type GenerateAIScriptActionFormItems = {
  prompt: MapForm<{
    selectedManualStep: FormField<string>;
    selectedManualStepID: FormField<string>;
    promptStep: FormField<string>;
    interpreterType: FormField<GeneratedActionInterpreter>;
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
  export: MapForm<{
    exportType: FormField<string>;
    agent: FormField<string>;
    repository: FormField<string>;
    branch: FormField<Option>;
    file_path: FormField<string>;
    content: FormField<string>;
    message: FormField<string>;
    base: FormField<string>;
    git_url: FormField<string>;
    pr_url: FormField<string>;
  }>;
};

export type GenerateAIScriptActionForm = MapForm<GenerateAIScriptActionFormItems>;

export function getActionFromForm(form: GenerateAIScriptActionForm): NewAction {
  const actionForm = form.get('action');
  const name = actionForm.get('name').value;
  const description = actionForm.get('description').value;
  const type = actionForm.get('type').value;
  const tags = actionForm.get('tags').value;
  const giturl = form.get('export').get('git_url').value;
  const gitType = form.get('export').get('exportType').value;
  const fields: Field[] = [];
  if (type === ACTION_TYPE.SCRIPT && giturl === '') {
    const value = actionForm.get('script').value;
    fields.push(...createScriptFields({ value, subtype: '', timeout: '' }));
  }
  if (type === ACTION_TYPE.SCRIPT && giturl !== '') {
    const value = form.get('export').get('git_url').value;
    fields.push(...createGitUrlFields({ value, type: gitType, timeout: '' }));
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
const defaultActionTags = ['ai'];
const defaultActionType: ActionType = 'SCRIPT';

// Validator for branch option
function branchOptionValidator(value: Option): ValidationResult {
  if (value.label === '' && value.value === '') {
    return [
      {
        severity: 'error' as Severity,
        message: t('in-automation:theValueMustNotBeBlank')
      }
    ];
  }
  return null;
}

function createGenerateAIActionForm() {
  const form: GenerateAIScriptActionForm = createMapForm({
    items: {
      prompt: createMapForm({
        items: {
          selectedManualStep: createField({
            value: '',
            validator: notBlankValidator
          }),
          selectedManualStepID: createField({
            value: '',
            validator: notBlankValidator
          }),
          promptStep: createField({
            value: '',
            validator: notBlankValidator
          }),
          interpreterType: createField({
            value: 'BASH' as GeneratedActionInterpreter,
            validator: notBlankValidator
          })
        }
      }),
      action: createMapForm({
        items: {
          name: createField({
            value: '',
            validator: notBlankValidator
          }),
          description: createField({
            value: '',
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
            value: '',
            validator: notBlankValidator
          }),
          content: createField({
            value: ''
          }),
          aiGeneratedContent: createField({
            value: '',
            validator: notBlankValidator
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
          if (type === ACTION_TYPE.SCRIPT) {
            return notBlankValidator(form.script.value);
          }
          return null;
        }
      }),
      export: createMapForm({
        items: {
          exportType: createField({
            value: 'internal'
          }),
          agent: createField({
            value: '',
            validator: notBlankValidator
          }),
          repository: createField({
            value: '',
            validator: notBlankValidator
          }),
          branch: createField<Option>({
            value: { label: '', value: '' },
            validator: branchOptionValidator
          }),
          file_path: createField({
            value: '',
            validator: notBlankValidator
          }),
          content: createField({
            value: '',
            validator: notBlankValidator
          }),
          message: createField({
            value: '',
            validator: notBlankValidator
          }),
          base: createField({
            value: ''
          }),
          git_url: createField({
            value: ''
          }),
          pr_url: createField({
            value: ''
          })
        }
      })
    },
    validator: form => {
      const exportType = form.export.get('exportType').value;
      const actionForm = form.action;
      const exportForm = form.export;

      if (exportType === 'internal') {
        return (
          notBlankValidator(actionForm.get('name').value) &&
          notBlankValidator(actionForm.get('description').value) &&
          notBlankValidator(actionForm.get('script').value)
        );
      }
      if (exportType === 'github' || exportType === 'gitlab') {
        return (
          notBlankValidator(exportForm.get('agent').value) &&
          notBlankValidator(exportForm.get('repository').value) &&
          notBlankValidator(exportForm.get('message').value) &&
          notBlankValidator(exportForm.get('content').value) &&
          notBlankValidator(exportForm.get('file_path').value)
        );
      }
      return null;
    }
  });

  return form;
}

export default function useGenerateAIScriptActionForm() {
  const [form, setForm] = useState(createGenerateAIActionForm());

  const resetForm = () => {
    setForm(createGenerateAIActionForm());
  };
  return [form, setForm, resetForm] as const;
}
