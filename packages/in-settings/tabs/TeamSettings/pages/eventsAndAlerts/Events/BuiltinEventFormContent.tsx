/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

export function createBuiltinEventFormDefinition(eventSpec: Map<string, unknown>) {
  const actionIds = (eventSpec?.get('actionIds') as string[]) ?? [];
  const name = eventSpec?.get('name') as string;
  const description = eventSpec?.get('description') as string;

  return createMapForm()
    .put(
      'actionIds',
      createField({
        value: actionIds
      })
    )
    .put(
      'name',
      createField({
        value: name
      })
    )
    .put(
      'description',
      createField({
        value: description
      })
    );
}
