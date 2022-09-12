/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm, MapForm } from 'formalistic';

export function createBuiltinEventFormDefinition(eventSpec: MapForm) {
  const actionIds = eventSpec ? eventSpec.toJS().actionIds : [];

  let form = createMapForm().put(
    'actionIds',
    createField({
      value: actionIds
    })
  );

  return form;
}
