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
  const startIndex = basicScript.indexOf('less than');
  const endIndex = basicScript.lastIndexOf(');');
  const updatedScript =
    basicScript.substring(0, startIndex) +
    `less than ${daysRemaining} days \`);
  };
  // this script will fail if the certificate remaining days less than ${daysRemaining} by default
  getSslDetails("${url}", "${daysRemaining}"` +
    basicScript.substring(endIndex);

  updateForm(
    form.updateIn(['configuration', 'script'], (field: Item) =>
      (field as Field<string>).setValue(updatedScript).setTouched(true)
    )
  );
  return updatedScript;
};
