/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createField, createMapForm, Field, MapForm } from 'formalistic';

export type SelectUserDialogFormFields = {
  userIds: Field<string[]>;
};

export function createSelectUserForm(preselectedIds?: string[]): MapForm<SelectUserDialogFormFields> {
  return createMapForm<SelectUserDialogFormFields>({
    items: {
      userIds: createField({
        value: preselectedIds ?? []
      })
    }
  });
}
