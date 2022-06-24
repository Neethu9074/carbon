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
        value: mappedTags,
        validator: notBlankValidator
      })
    );
  form = putDocLinkFields(form, action);
  return form;
}

export function putDocLinkFields(form: MapForm, action: ImmutableNewAction) {
  const fields = action.get('fields') as List<Map<string, string>>;
  const field = fields.get(0);

  return form
    .put(
      'docLinkValue',
      createField({
        value: field.get('value'),
        validator: notBlankValidator
      })
    )
    .put(
      'docLinkDescription',
      createField({
        value: field.get('description'),
        validator: notBlankValidator
      })
    );
}
