import PropTypes from 'prop-types';
import React from 'react';

import { ruleStatusCodeValueOptions } from 'in-websites/alerting/form/ruleFormData';
import { websitesAlertingStatusCodeChanged } from 'in-websites/alerting/tracker';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Label from 'in-components/form/Label';

import locals from './ProvideJsError.mless';

export default function ProvideStatusCode({ form, mode, updateForm }) {
  return (
    <div className={locals.container}>
      {form
        .get('rule')
        .get('value')
        .map(field => (
          <FormGroup>
            <Label htmlFor={'ruleValue'} hasError={!field.valid && field.touched}>
              Status Code
            </Label>
            <ComboBox
              name={'ruleValue'}
              value={field.value}
              options={ruleStatusCodeValueOptions}
              onChange={e => {
                websitesAlertingStatusCodeChanged({ mode });
                updateForm(
                  form
                    .updateIn(['rule', 'value'], f => f.setValue((e && e.value) || '').setTouched(true))
                    .updateIn(['rule', 'operator'], f => f.setValue(getOperatorForStatusCode(e.value)).setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                    .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                );
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
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getOperatorForStatusCode(statusCode) {
  return statusCode && statusCode.length === 3 ? operators.EQUALS : operators.STARTS_WITH;
}
