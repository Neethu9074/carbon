/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

import { notBlankValidator } from 'in-services/validators/string';

// eslint-disable-next-line no-unused-vars
export function createActionFormDefinition(eventSpec, isCreate) {
  // eslint-disable-next-line no-undef
  const mutableEvent = getMutableEventSpecification(eventSpec);
  const { name, description } = mutableEvent;

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
    );

  return form;
}
