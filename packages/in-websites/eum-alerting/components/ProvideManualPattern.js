import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import React from 'react';

import {
  websitesAlertingJsErrorsMsgChanged,
  websitesAlertingJsErrorsOperatorChanged,
  websitesAlertingJsErrorsErrorSelected,
  websitesAlertingJsErrorsOpenErrorSelectView
} from 'in-websites/eum-alerting/tracker';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import JsErrorsList from 'in-websites/eum-alerting/simple/JsErrorsList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Button from 'in-new-components/Button/Button';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';

import locals from './ProvideManualPattern.mless';

const debouncedErrorMsgChangedTracker = debounce(websitesAlertingJsErrorsMsgChanged, 300);

export default function ProvideManualPattern({ form, timeConfig, onSelectJsError, mode, updateForm }) {
  const operatorField = form.get(fieldNames.ruleOperator);
  const ruleValueField = form.get(fieldNames.ruleValue);

  return (
    <div className={locals.container}>
      {operatorField.map(field => (
        <FormGroup>
          <Label htmlFor={fieldNames.ruleOperator} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={fieldNames.ruleOperator}
            value={field.value}
            options={selectOptions[fieldNames.ruleOperator]}
            onChange={e => {
              websitesAlertingJsErrorsOperatorChanged(mode);
              const previousOperator = field.value;
              const newOperator = (e && e.value) || '';
              let newRuleValueValue = 'Any';
              if (previousOperator === operators.NOT_EMPTY) {
                newRuleValueValue = '';
              } else if (newOperator !== operators.NOT_EMPTY) {
                newRuleValueValue = ruleValueField.value;
              }

              updateForm(
                form
                  .updateIn([fieldNames.ruleOperator], f => f.setValue(newOperator).setTouched(true))
                  .updateIn([fieldNames.ruleValue], f => f.setValue(newRuleValueValue).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );
            }}
            defaultValue={selectOptions[fieldNames.ruleOperator][0].value}
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.value !== operators.NOT_EMPTY &&
        ruleValueField.map(field => (
          <FormGroup>
            <div className={locals.jsErrorSelection}>
              <TextArea
                name={fieldNames.ruleValue}
                rows="3"
                value={field.value}
                onChange={e => {
                  debouncedErrorMsgChangedTracker(mode);
                  updateForm(
                    form
                      .updateIn([fieldNames.ruleValue], f => f.setValue((e && e.target.value) || '').setTouched(true))
                      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  );
                }}
                hasError={!field.valid && field.touched}
                maxLength={65536}
              />
              <Button
                onClick={() => {
                  websitesAlertingJsErrorsOpenErrorSelectView(mode);
                  onSelectJsError({
                    slideInConfig: {
                      component: (
                        <JsErrorsList
                          form={form}
                          timeConfig={timeConfig}
                          onChange={(updatedForm, fieldName, message) => {
                            websitesAlertingJsErrorsErrorSelected({ message, mode });
                            updateForm(
                              updatedForm
                                .updateIn([fieldName], f => f.setValue(message).setTouched(true))
                                .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                            );
                          }}
                          slideOut={() => onSelectJsError({ isVisible: false })}
                        />
                      ),
                      title: 'Select JS Error'
                    },
                    isVisible: true
                  });
                }}
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
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired,
  onSelectJsError: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};
