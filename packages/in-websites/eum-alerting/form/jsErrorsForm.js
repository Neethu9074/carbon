import { createField, notBlankValidator } from 'formalistic';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import { operators } from 'in-analyze/applicationFilter';

export function withJsErrorsFormSpecificError(form, rule = null) {
  let updatedForm = form;

  updatedForm = updatedForm.remove(fieldNames.ruleAggregation);
  updatedForm = updatedForm.remove(fieldNames.ruleOperator);
  updatedForm = updatedForm.remove(fieldNames.ruleValue);
  updatedForm = updatedForm.remove(fieldNames.thresholdBaseline);
  updatedForm = updatedForm.remove(fieldNames.thresholdDeviationFactor);

  updatedForm = updatedForm
    .put(
      fieldNames.ruleOperator,
      createField({
        value: (rule && rule.operator) || operators.EQUALS,
        validator: notBlankValidator
      })
    )
    .put(
      fieldNames.ruleValue,
      createField({
        value: (rule && rule.value) || '',
        validator: notBlankValidator
      })
    );

  return updatedForm;
}
