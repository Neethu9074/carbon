/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecifications';

export function createBuiltinEventFormDefinition(eventSpec) {
  const mutableEvent = getMutableEventSpecification(eventSpec);

  const { actionIds } = mutableEvent;

  let form = createMapForm();

  form = putActionField(form, actionIds);

  return form;
}

export function putActionField(form, tagValue) {
  return form.put(
    'actionIds',
    createField({
      value: tagValue ?? []
    })
  );
}

function getMutableEventSpecification(eventSpec) {
  return eventSpec ? eventSpec.toJS() : createCustomThresholdBasedEventSpecification();
}
