/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import {
  ruleLogMessageOperatorOptions,
  ruleLogLevelOptions
} from 'in-alerting/smart-alerts/applications/form/ruleFormData';
//@ts-expect-error
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import ComboBox, { Option, Options } from 'in-components/ComboBox';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

interface ProvideLogMessageProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
export default function ProvideLogMessage({ form, updateForm }: ProvideLogMessageProps) {
  const operatorField = form.get('rule').get('operator');
  const messageField = form.get('rule').get('message');
  const levelField = form.get('rule').get('level');

  return (
    <div>
      {levelField.map((field: Field<string>) => (
        <FormGroup>
          <Label htmlFor={'ruleLevel'} hasError={!field.valid && field.touched}>
            {t('in-alerting:smartAlerts.applications.components.provideLogMessageLogLevel')}
          </Label>
          <ComboBox
            name={'ruleLevel'}
            value={field.value}
            options={ruleLogLevelOptions}
            onChange={(e: Option | Options | null) => {
              const newLevel = (e && (e as Option).value) || '';
              updateForm(
                form.updateIn(['rule', 'level'], f => (f as Field<string>).setValue(newLevel).setTouched(true))
              );
            }}
            defaultValue={ruleLogLevelOptions[0].value}
            isClearable={false}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.map((field: Field<string>) => (
        <FormGroup>
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            {t('in-alerting:smartAlerts.applications.components.provideLogMessageErrorMessage')}
          </Label>
          <ComboBox
            name={'ruleOperator'}
            value={field.value}
            options={ruleLogMessageOperatorOptions}
            onChange={(e: Option | Options | null) => {
              const previousOperator = field.value;
              const newOperator = (e && (e as Option).value) || '';
              let newRuleValueValue = 'Any';
              if (previousOperator === operators.NOT_EMPTY) {
                newRuleValueValue = '';
              } else if (newOperator !== operators.NOT_EMPTY) {
                newRuleValueValue = messageField.value;
              }

              updateForm(
                form
                  .updateIn(['rule', 'operator'], f => (f as Field<string>).setValue(newOperator).setTouched(true))
                  .updateIn(['rule', 'message'], f => f.setValue(newRuleValueValue).setTouched(true))
              );
            }}
            defaultValue={ruleLogMessageOperatorOptions[0].value}
            isClearable={false}
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.value !== operators.NOT_EMPTY &&
        messageField.map((field: Field<string>) => (
          <FormGroup>
            <DebouncedTextArea
              name={'ruleMessage'}
              rows={3}
              value={field.value}
              onValueChange={(value: string) => {
                updateForm(
                  form.updateIn(['rule', 'message'], f => (f as Field<string>).setValue(value ?? '').setTouched(true))
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
