/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createField, createMapForm } from 'formalistic';

import { Action } from 'in-types';

export function addActionForm(actions: Action[]) {
  return createMapForm().put(
    'actionIds',
    createField({
      value: actions.map((s: { id: string }) => s.id)
    })
  );
}
