/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, Item, MapForm } from 'formalistic';

export const certificateCheckScriptUpdater = (
  basicScript: string,
  url: string,
  daysRemaining: string,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void
): string => {
  // logic for replacing parameters within getSslDetails()
  const startIndex = basicScript.indexOf('getSslDetails(');
  const endIndex = basicScript.lastIndexOf(');');
  const updatedScript =
    basicScript.substring(0, startIndex) +
    `getSslDetails("${url}", "${daysRemaining}"` +
    basicScript.substring(endIndex);
  updateForm(
    form.updateIn(['configuration', 'script'], (field: Item) =>
      (field as Field<string>).setValue(updatedScript).setTouched(true)
    )
  );
  return updatedScript;
};
