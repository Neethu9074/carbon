import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';

export function withJsErrorsFormSpecificError(form) {
  let updatedForm = form;

  updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
  updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);

  return updatedForm;
}
