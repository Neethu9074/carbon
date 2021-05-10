/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import {
  websitesAlertingJsErrorsMsgChanged,
  websitesAlertingJsErrorsOperatorChanged,
  websitesAlertingJsErrorsErrorSelected,
  websitesAlertingJsErrorsOpenErrorSelectView
} from 'in-alerting/smart-alerts/websites/tracker';
import { ruleJsErrorsOperatorOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import JsErrorsList from 'in-alerting/smart-alerts/websites/components/JsErrorsList';
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/ProvideJsError.mless';

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
              {t('in-alerting:smartAlerts.websites.components.selectJSErrorHelpText')}
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
                        tagFilterExpression={form.get('tagFilterExpression').value}
                        timeConfig={timeConfig}
                        onJsErrorSelect={message => {
                          websitesAlertingJsErrorsErrorSelected({ message, mode });
                          updateForm(
                            form
                              .updateIn(['rule', 'value'], f => f.setValue(message).setTouched(true))
                              .updateIn(['rule', 'operator'], field =>
                                field.setValue(operators.EQUALS).setTouched(true)
                              )
                          );
                        }}
                        slideOut={() => onSelectJsError({ isVisible: false })}
                      />
                    ),
                    title: t('in-alerting:smartAlerts.websites.components.selectJSErrorTitle')
                  },
                  isVisible: true
                });
              }}
            >
              {t('in-alerting:smartAlerts.websites.components.selectJSErrorTitle')}
            </Button>
          </div>
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            {t('in-alerting:smartAlerts.websites.components.errorMessage')}
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
                updateForm(form.updateIn(['rule', 'value'], f => f.setValue(value ?? '').setTouched(true)));
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
