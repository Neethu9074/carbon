/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';
import { NewAction } from 'in-api/automation';

import { notBlankValidator } from 'in-services/validators/string';

// eslint-disable-next-line no-unused-vars
export function createActionFormDefinition(action: NewAction, isCreate: boolean) {
  // eslint-disable-next-line no-undef
  const { name, description, fields } = action;

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
      'fields',
      createField({
        value: fields,
        validator: notBlankValidator
      })
    );

  return form;
}
