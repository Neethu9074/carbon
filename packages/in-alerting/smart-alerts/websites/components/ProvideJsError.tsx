/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
//@ts-expect-error TS migration
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { ruleJsErrorsOperatorOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import JsErrorsList from 'in-alerting/smart-alerts/websites/components/JsErrorsList';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { SliderState } from 'in-synthetics/utils/constants';
import ComboBox, { Option } from 'in-components/ComboBox';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/ProvideJsError.mless';

interface ProvideJsErrorProps {
  form: MapForm<any>;
  timeConfig: TimeConfig;
  onSelectJsError: ({ slideInConfig, isVisible }: SliderState) => void;
  mode: string;
  updateForm: (form: MapForm<any>) => void;
  tearSheetView?: boolean;
}

export default function ProvideJsError({
  form,
  timeConfig,
  onSelectJsError,
  mode,
  updateForm,
  tearSheetView = false
}: ProvideJsErrorProps) {
  const operatorField = form.get('rule').get('operator');
  const ruleValueField = form.get('rule').get('value');

  return (
    <div className={locals.container}>
      {operatorField.map((field: Field<string>) => (
        <FormGroup>
          <div
            className={classNames({
              [locals.errorMessageSelectWrapper]: true,
              [locals.jsErrorsSelectAdvanceMode]: mode === modeAdvanced
            })}
          >
            {!tearSheetView && (
              <>
                <HelpText className={locals.helpText}>
                  {t('in-alerting:smartAlerts.websites.components.selectJSErrorHelpText')}
                </HelpText>
                <Button
                  className={classNames({
                    [locals.jsErrorsSelectButtonAdvanceMode]: mode === modeAdvanced
                  })}
                  onClick={() => {
                    onSelectJsError({
                      slideInConfig: {
                        component: (
                          <AlertConfigSlideInContentWrapper>
                            <JsErrorsList
                              websiteId={form.get('websiteId').value}
                              tagFilterExpression={form.get('tagFilterExpression').value}
                              timeConfig={timeConfig}
                              onJsErrorSelect={message => {
                                updateForm(
                                  form
                                    .updateIn(['rule', 'value'], f =>
                                      (f as Field<string>).setValue(message).setTouched(true)
                                    )
                                    .updateIn(['rule', 'operator'], field =>
                                      field.setValue(operators.EQUALS).setTouched(true)
                                    )
                                );
                              }}
                              slideOut={() => onSelectJsError({ isVisible: false })}
                            />
                          </AlertConfigSlideInContentWrapper>
                        ),
                        title: t('in-alerting:smartAlerts.websites.components.selectJSErrorTitle')
                      },
                      isVisible: true
                    });
                  }}
                >
                  {t('in-alerting:smartAlerts.websites.components.selectJSErrorTitle')}
                </Button>
              </>
            )}
          </div>
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            {t('in-alerting:smartAlerts.websites.components.errorMessage')}
          </Label>
          <ComboBox
            name={'ruleOperator'}
            value={field.value}
            options={ruleJsErrorsOperatorOptions}
            onChange={e => {
              const previousOperator = field.value;
              const newOperator = (e && (e as Option).value) || '';
              let newRuleValueValue = 'Any';
              if (previousOperator === operators.NOT_EMPTY) {
                newRuleValueValue = '';
              } else if (newOperator !== operators.NOT_EMPTY) {
                newRuleValueValue = ruleValueField.value;
              }

              updateForm(
                form
                  .updateIn(['rule', 'operator'], f => (f as Field<string>).setValue(newOperator).setTouched(true))
                  .updateIn(['rule', 'value'], f => f.setValue(newRuleValueValue).setTouched(true))
              );
            }}
            defaultValue={ruleJsErrorsOperatorOptions[0].value}
            isClearable={false}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.value !== operators.NOT_EMPTY &&
        ruleValueField.map((field: Field<string>) => (
          <FormGroup>
            <DebouncedTextArea
              className={locals.jsErrorTextInput}
              name={'ruleValue'}
              rows="3"
              value={field.value}
              onValueChange={(value: string) => {
                updateForm(
                  form.updateIn(['rule', 'value'], f => (f as Field<string>).setValue(value ?? '').setTouched(true))
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
