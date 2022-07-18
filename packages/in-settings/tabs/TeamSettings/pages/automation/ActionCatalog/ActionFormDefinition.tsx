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
  const tags = (action.get('tags') as string[]) ?? [];
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
        value: List(mappedTags),
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
  form = putDocLinkFields(form, action);
  return form;
}

export function putDocLinkFields(form: MapForm, action: ImmutableNewAction) {
  const fields = action.get('fields') as List<Map<string, string>>;
  const field = fields.get(0);

  return form.put(
    'docLinkValue',
    createField({
      value: field.get('value'),
      validator: notBlankValidator
    })
  );
}
