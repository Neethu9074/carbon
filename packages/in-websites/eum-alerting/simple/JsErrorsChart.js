import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import EumAlertingBarChart from '../chart/EumAlertingBarChart';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import SvgIcon from 'in-components/SvgIcon';

import locals from './JsErrorsChart.mless';

export default function JsErrorsChart({ form, timeConfig, onChange }) {
  return (
    <div className={locals.container}>
      {hasJsErrorSelected(form) ? (
        <>
          <EumAlertingBarChart
            threshold={form.get(fieldNames.thresholdValue).value}
            timeConfig={timeConfig}
            tagFilters={[
              {
                name: 'beacon.error.message',
                operator: form.get(fieldNames.ruleOperator).value,
                stringValue: form.get(fieldNames.ruleValue).value
              },
              ...form.get(fieldNames.tagFilters).value
            ]}
          />
          {onChange && (
            <FormGroup className={locals.thresholdInput}>
              <Label>Threshold</Label>
              <Input
                type="number"
                min="0"
                name={fieldNames.thresholdValue}
                value={form.get(fieldNames.thresholdValue).value}
                step="1"
                onChange={e =>
                  onChange(form, fieldNames.thresholdValue, e.target.value !== '' ? Math.abs(e.target.value) : '')
                }
              />
            </FormGroup>
          )}
        </>
      ) : (
        <div className={locals.message}>
          <SvgIcon type="lib_help_error_error_outline" size="xs" />
          <span>Please select a JS Error to see when this alert triggers</span>
        </div>
      )}
    </div>
  );
}

JsErrorsChart.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  timeConfig: PropTypes.object.isRequired
};

function hasJsErrorSelected(form) {
  return !!(form && form.get(fieldNames.ruleValue).value);
}
