/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm } from 'formalistic';

import { notBlankValidator } from 'in-services/validators/string';
import { NewAction } from 'in-api/automation';

export function createActionFormDefinition(action: NewAction, _isCreate: boolean) {
  const { name, description, type, tags } = action;

  let form = createMapForm()
    .put(
      'name',
      createField({
        value: name,
        validator: notBlankValidator
      })
    )
    .put(
      'description',
      createField({
        value: description,
        validator: notBlankValidator
      })
    )
    .put(
      'type',
      createField({
        value: type,
        validator: notBlankValidator
      })
    )
    .put(
      'tags',
      createField({
        value: tags,
        validator: notBlankValidator
      })
    );

  form = putDocLinkFields(form, action);
  return form;
}

export function putDocLinkFields(form: MapForm, action: NewAction) {
  const { fields } = action;
  const field = fields?.[0];
  const { value, description } = field ?? {};
  return form
    .put(
      'docLinkValue',
      createField({
        value: value,
        validator: notBlankValidator
      })
    ).put(
      'docLinkDescription',
      createField({
        value: description,
        validator: notBlankValidator
      })
    );
}
