import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsList from 'in-websites/eum-alerting/simple/JsErrorsList.js';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Button from 'in-new-components/Button/Button';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';

import locals from './ProvideManualPattern.mless';

export function ProvideManualPattern({ form, timeConfig, onChange, onSelectJsError }) {
  return (
    <div className={locals.container}>
      {form.get(fieldNames.operator).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.operator} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={fieldNames.operator}
            value={field.value}
            options={getOperators()}
            onChange={e => onChange(form, fieldNames.operator, (e && e.value) || '')}
            defaultValue={getOperators()[0].value}
            searchable
            autoFocus
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get(fieldNames.value).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.value} hasError={!field.valid && field.touched}>
            String
          </Label>
          <div className={locals.jsErrorSelection}>
            <TextArea
              name={fieldNames.value}
              rows="3"
              value={field.value}
              onChange={e => onChange(form, fieldNames.value, (e && e.target.value) || '')}
              hasError={!field.valid && field.touched}
              maxLength={65536}
            />
            <Button
              onClick={() =>
                onSelectJsError({
                  component: (
                    <JsErrorsList
                      form={form}
                      timeConfig={timeConfig}
                      onChange={onChange}
                      slideOut={() => {
                        onSelectJsError(null);
                      }}
                    />
                  ),
                  title: 'Select JS Error'
                })
              }
            >
              Select JS Error
            </Button>
          </div>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
    </div>
  );
}

ProvideManualPattern.propTypes = {
  form: PropTypes.object.isRequired,
  timeConfig: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onSelectJsError: PropTypes.func.isRequired
};

function getOperators() {
  return Object.freeze([
    { value: operators.EQUALS, label: 'Equals' },
    { value: operators.CONTAINS, label: 'Contains' },
    { value: operators.STARTS_WITH, label: 'Starts with' },
    { value: operators.ENDS_WITH, label: 'Ends with' }
  ]);
}
