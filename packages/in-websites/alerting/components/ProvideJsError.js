import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingJsErrorsMsgChanged,
  websitesAlertingJsErrorsOperatorChanged,
  websitesAlertingJsErrorsErrorSelected,
  websitesAlertingJsErrorsOpenErrorSelectView
} from 'in-websites/alerting/tracker';
import { ruleJsErrorsOperatorOptions } from 'in-websites/alerting/form/ruleFormData';
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import JsErrorsList from 'in-websites/alerting/components/JsErrorsList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { modeAdvanced } from 'in-websites/alerting/constants';
import evaluateClassNames from 'in-services/util/classnames';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Button from 'in-new-components/Button/Button';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';

import locals from './ProvideJsError.mless';

export default function ProvideJsError({ form, timeConfig, onSelectJsError, mode, updateForm }) {
  const operatorField = form.get('rule').get('operator');
  const ruleValueField = form.get('rule').get('value');

  return (
    <div className={locals.container}>
      {operatorField.map(field => (
        <FormGroup>
          <div
            className={evaluateClassNames({
              [locals.errorMessageSelectWrapper]: true,
              [locals.jsErrorsSelectAdvanceMode]: mode === modeAdvanced
            })}
          >
            <HelpText className={locals.helpText}>Select JS error message as template (optional)</HelpText>
            <Button
              className={evaluateClassNames({
                [locals.jsErrorsSelectButtonAdvanceMode]: mode === modeAdvanced
              })}
              onClick={() => {
                websitesAlertingJsErrorsOpenErrorSelectView({ mode });
                onSelectJsError({
                  slideInConfig: {
                    component: (
                      <JsErrorsList
                        websiteId={form.get('websiteId').value}
                        tagFilters={form.get('tagFilters').value}
                        timeConfig={timeConfig}
                        onJsErrorSelect={message => {
                          websitesAlertingJsErrorsErrorSelected({ message, mode });
                          updateForm(
                            form
                              .updateIn(['rule', 'value'], f => f.setValue(message).setTouched(true))
                              .updateIn(['rule', 'operator'], field =>
                                field.setValue(operators.EQUALS).setTouched(true)
                              )
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
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={'ruleOperator'}
            value={field.value}
            options={ruleJsErrorsOperatorOptions}
            onChange={e => {
              websitesAlertingJsErrorsOperatorChanged({ mode });
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
                  .updateIn(['rule', 'operator'], f => f.setValue(newOperator).setTouched(true))
                  .updateIn(['rule', 'value'], f => f.setValue(newRuleValueValue).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
              );
            }}
            defaultValue={ruleJsErrorsOperatorOptions[0].value}
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.value !== operators.NOT_EMPTY &&
        ruleValueField.map(field => (
          <FormGroup>
            <DebouncedTextArea
              className={locals.jsErrorTextInput}
              name={'ruleValue'}
              rows="3"
              value={field.value}
              onValueChange={value => {
                websitesAlertingJsErrorsMsgChanged({ mode });
                updateForm(
                  form
                    .updateIn(['rule', 'value'], f => f.setValue(value ?? '').setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                );
              }}
              hasError={!field.valid && field.touched}
              maxLength={65536}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </div>
  );
}

ProvideJsError.propTypes = {
  form: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired,
  onSelectJsError: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};
