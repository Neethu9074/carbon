/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecifications';
import { notBlankValidator } from 'in-services/validators/string';

export function createBuiltinEventFormDefinition(eventSpec) {
  const mutableEvent = getMutableEventSpecification(eventSpec);

  mutableEvent.actionIds = eventSpec.actionIds; // this is current actionIds value
  mutableEvent.saveActionIds = eventSpec.actionIds; // Need this to compare saved value from current Actionids in edit page
  const { name, description, actionIds, saveActionIds } = mutableEvent;

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
  form = putActionField(form, actionIds);
  form = putSaveActionField(form, saveActionIds);

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

export function putSaveActionField(form, tagValue) {
  return form.put(
    'saveActionIds',
    createField({
      value: tagValue ?? []
    })
  );
}

function getMutableEventSpecification(eventSpec) {
  return eventSpec ? eventSpec.toJS() : createCustomThresholdBasedEventSpecification();
}
