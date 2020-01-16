import PropTypes from 'prop-types';
import React from 'react';

import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsList from 'in-websites/eum-alerting/simple/JsErrorsList.js';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Button from 'in-new-components/Button/Button';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';

import locals from './ProvideManualPattern.mless';

const doCalculateThresholdOnBackend = { name: fieldNames.calculateThresholdOnBackend, value: true };

export default function ProvideManualPattern({ form, timeConfig, onChange, onSelectJsError }) {
  return (
    <div className={locals.container}>
      {form.get(fieldNames.ruleOperator).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.ruleOperator} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={fieldNames.ruleOperator}
            value={field.value}
            options={selectOptions[fieldNames.ruleOperator]}
            onChange={e => onChange(form, fieldNames.ruleOperator, (e && e.value) || '', doCalculateThresholdOnBackend)}
            defaultValue={selectOptions[fieldNames.ruleOperator][0].value}
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {form.get(fieldNames.ruleValue).map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.ruleValue} hasError={!field.valid && field.touched}>
            String
          </Label>
          <div className={locals.jsErrorSelection}>
            <TextArea
              name={fieldNames.ruleValue}
              rows="3"
              value={field.value}
              onChange={e =>
                onChange(form, fieldNames.ruleValue, (e && e.target.value) || '', doCalculateThresholdOnBackend)
              }
              hasError={!field.valid && field.touched}
              maxLength={65536}
            />
            <Button
              onClick={() =>
                onSelectJsError({
                  slideInConfig: {
                    component: (
                      <JsErrorsList
                        form={form}
                        timeConfig={timeConfig}
                        onChange={(updatedForm, fieldName, message) =>
                          onChange(updatedForm, fieldName, message, doCalculateThresholdOnBackend)
                        }
                        slideOut={() => onSelectJsError({ isVisible: false })}
                      />
                    ),
                    title: 'Select JS Error'
                  },
                  isVisible: true
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
  onChange: PropTypes.func.isRequired,
  onSelectJsError: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};
