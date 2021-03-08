/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import {
  websitesAlertingJsErrorsMsgChanged,
  websitesAlertingJsErrorsOperatorChanged,
  websitesAlertingJsErrorsErrorSelected,
  websitesAlertingJsErrorsOpenErrorSelectView
} from 'in-alerting/smart-alerts/websites/alerting/tracker';
import { ruleJsErrorsOperatorOptions } from 'in-alerting/smart-alerts/websites/alerting/form/ruleFormData';
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import JsErrorsList from 'in-alerting/smart-alerts/websites/alerting/components/JsErrorsList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/alerting/constants';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';

import locals from 'in-alerting/smart-alerts/websites/alerting/components/ProvideJsError.mless';

export default function ProvideJsError({ form, timeConfig, onSelectJsError, mode, updateForm }) {
  const operatorField = form.get('rule').get('operator');
  const ruleValueField = form.get('rule').get('value');

  return (
    <div className={locals.container}>
      {operatorField.map(field => (
        <FormGroup>
          <div
            className={classNames({
              [locals.errorMessageSelectWrapper]: true,
              [locals.jsErrorsSelectAdvanceMode]: mode === modeAdvanced
            })}
          >
            <HelpText className={locals.helpText}>
              {t('in-websites:alerting.components.selectJSErrorHelpText')}
            </HelpText>
            <Button
              className={classNames({
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
                    title: t('in-websites:alerting.components.selectJSErrorTitle')
                  },
                  isVisible: true
                });
              }}
            >
              {t('in-websites:alerting.components.selectJSErrorTitle')}
            </Button>
          </div>
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            {t('in-websites:alerting.components.errorMessage')}
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
