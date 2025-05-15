/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

export type EntitiesFormFields = {
  selectedIds: Field<string[]>;
};

export function createEntitiesForm(initValues?: string[]): MapForm<EntitiesFormFields> {
  return createMapForm<EntitiesFormFields>({
    items: {
      selectedIds: createField({
        value: initValues ?? []
      })
    }
  });
}
