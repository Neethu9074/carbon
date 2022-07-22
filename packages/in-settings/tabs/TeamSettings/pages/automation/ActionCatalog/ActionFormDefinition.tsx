/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { List, Map } from 'immutable';

import { generateUniqueShortId } from '@instana/utils';

import { notBlankValidator } from 'in-services/validators/string';
import { ImmutableNewAction } from 'in-api/automation';
import { t } from 'in-i18n';

export function createActionFormDefinition(action: ImmutableNewAction, _isCreate: boolean) {
  const tags = (action.get('tags') as List<string>) ?? List();
  const mappedTags = tags.map(tag => ({ value: tag, id: generateUniqueShortId() }));

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: action.get('name'),
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: action.get('description'),
        validator: notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: action.get('type'),
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
  if (action.get('type') === 'doc_link') form = putDocLinkFields(form, action);
  else if (action.get('type') === 'SCRIPT') form = putScriptField(form, action);
  return form;
}

export function putDocLinkFields(form: MapForm, action: ImmutableNewAction) {
  const fields = action.get('fields') as List<Map<string, unknown>>;
  const field = fields.get(0);

  return form.put(
    'docLinkValue',
    createField({
      value: field.get('value'),
      validator: notBlankValidator
    })
  );
}

export function putScriptField(form: MapForm, action: ImmutableNewAction) {
  const fields = action.get('fields') as List<Map<string, unknown>>;
  let value = '';
  if (fields.size === 2) {
    const field = fields.get(1);
    value = atob(field.get('value') as string);
  }

  return form.put(
    'script',
    createField({
      value: value,
      validator: notBlankValidator
    })
  );
}
