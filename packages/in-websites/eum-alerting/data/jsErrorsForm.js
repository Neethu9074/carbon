import { createField, notBlankValidator } from 'formalistic';

import { fieldNames } from 'in-websites/eum-alerting/data/alertDialogFormDefinition';
import { operators } from 'in-analyze/applicationFilter';

export function withJsErrorsFormSpecificError(form, rule) {
  let updatedForm = form;

  updatedForm = updatedForm.remove(fieldNames.ruleAggregation);

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
        value: rule && rule.value,
        validator: notBlankValidator
      })
    );

  return updatedForm;
}
