/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { generateUniqueShortId } from '@instana/utils';

import {
  getDocLinkFromFields,
  getScriptFromFields,
  isDocLink,
  isScript
} from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import { notBlankValidator } from 'in-services/validators/string';
import { NewAction } from 'in-api/automation';
import { t } from 'in-i18n';

export function createActionFormDefinition(action: NewAction, _isCreate: boolean) {
  const tags = action.tags ?? [];
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: action.name,
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: action.description ?? '',
        validator: notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: action.type,
        validator: notBlankValidator
      })
    )
    .put(
      'tags',
      createField({
        value: mappedTags,
        validator: tags => {
          const hasBlankTags = tags.reduce((hasBlank, tag) => hasBlank || tag?.value === '', false);
          if (hasBlankTags) {
            return [
              {
                severity: 'error',
                message: t('in-services:validators.theValueMustNotBeBlank')
              }
            ];
          }
          return null;
        }
      })
    );
  if (isDocLink(action.type)) form = putDocLinkFields(form, action);
  else if (isScript(action.type)) form = putScriptField(form, action);
  return form;
}

export function putDocLinkFields(form: MapForm, action: NewAction) {
  const field = getDocLinkFromFields(action.fields);
  const value = isDocLink(action.type) ? field?.value : '';

  return form.put(
    'docLink',
    createField({
      value: value ?? '',
      validator: notBlankValidator
    })
  );
}

export function putScriptField(form: MapForm, action: NewAction) {
  let value = '';
  if (isScript(action.type)) {
    const field = getScriptFromFields(action.fields);
    value = atob(field?.value ?? '');
  }

  return form.put(
    'script',
    createField({
      value,
      validator: notBlankValidator
    })
  );
}
