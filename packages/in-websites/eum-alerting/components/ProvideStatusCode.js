import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Label from 'in-components/form/Label';

import locals from './ProvideManualPattern.mless';

const doCalculateThresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };

export default function ProvideStatusCode({ form, onChange }) {
  return (
    <div className={locals.container}>
      {form.get(fieldNames.ruleValue).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.ruleValue} hasError={!field.valid && field.touched}>
            Status Code
          </Label>
          <ComboBox
            name={fieldNames.ruleValue}
            value={field.value}
            options={selectOptions[fieldNames.ruleValue]}
            onChange={e => {
              onChange(form, fieldNames.ruleValue, (e && e.value) || '', doCalculateThresholdOnBackend, {
                name: fieldNames.ruleOperator,
                value: getOperatorForStatusCode(e.value)
              });
            }}
            defaultValue="4"
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
}

ProvideStatusCode.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

function getOperatorForStatusCode(statusCode) {
  return statusCode && statusCode.length === 3 ? operators.EQUALS : operators.STARTS_WITH;
}
