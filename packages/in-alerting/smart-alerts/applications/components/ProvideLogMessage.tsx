/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import {
  ruleLogMessageOperatorOptions,
  ruleLogLevelOptions
} from 'in-alerting/smart-alerts/applications/form/ruleFormData';
//@ts-expect-error TS migration
import LogMessagesList from 'in-alerting/smart-alerts/applications/components/LogMessagesList';
import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
//@ts-expect-error TS migration
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import ComboBox, { Option, Options } from 'in-components/ComboBox';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage.mless';

interface ProvideLogMessageProps {
  form: MapForm<any>;
  timeConfig: TimeConfig;
  onSelectLogMessage: (state: SliderState) => void;
  mode: string;
  updateForm: (form: MapForm<any>) => void;
}
export default function ProvideLogMessage({
  form,
  timeConfig,
  onSelectLogMessage,
  mode,
  updateForm
}: ProvideLogMessageProps) {
  const operatorField = form.get('rule').get('operator');
  const messageField = form.get('rule').get('message');
  const levelField = form.get('rule').get('level');
  const warningThresholdValuePresent = form.get('threshold')?.get('warningThreshold')?.get('isCheckboxSelected')?.value;
  const criticalThresholdValuePresent = form
    .get('threshold')
    ?.get('criticalThreshold')
    ?.get('isCheckboxSelected')?.value;
  const selectedChannelsArray = form.get('hiddenFields')?.get('selectedChannelList')?.value;

  return (
    <div className={locals.container}>
      <FormGroup>
        <div
          className={classNames({
            [locals.logMessageSelectAdvanceMode]: mode === modeAdvanced
          })}
        >
          <HelpText className={locals.helpText}>
            {t('in-alerting:smartAlerts.applications.logMessages.selectLogMessageText')}
          </HelpText>
          <Button
            className={classNames({
              [locals.logMessageSelectButtonAdvanceMode]: mode === modeAdvanced
            })}
            onClick={() => {
              onSelectLogMessage({
                slideInConfig: {
                  component: (
                    <AlertConfigSlideInContentWrapper>
                      <LogMessagesList
                        applications={form.get('applications').value}
                        tagFilterExpression={form.get('tagFilterExpression').value}
                        applicationBoundaryScope={form.get('boundaryScope').value}
                        includeInternal={form.get('includeInternal').value}
                        includeSynthetic={form.get('includeSynthetic').value}
                        timeConfig={timeConfig}
                        onLogMessageSelect={(message: string, level: string) => {
                          let updatedForm = form
                            .updateIn(['rule', 'message'], f => (f as Field<string>).setValue(message).setTouched(true))
                            .updateIn(['rule', 'operator'], field => field.setValue(operators.EQUALS))
                            .updateIn(['rule', 'level'], f => f.setValue(level).setTouched(true));
                          //While Switching the BP to log and onLogMessageSelect update/reset the alert channels list to warning
                          if (!warningThresholdValuePresent && !criticalThresholdValuePresent) {
                            updatedForm = updatedForm.updateIn(['alertChannels'], f =>
                              (f as any)
                                .setValue({
                                  WARNING: selectedChannelsArray,
                                  CRITICAL: []
                                })
                                .setTouched(true)
                            );
                          }
                          updateForm(updatedForm);
                        }}
                        slideOut={() => onSelectLogMessage({ isVisible: false })}
                      />
                    </AlertConfigSlideInContentWrapper>
                  ),
                  title: t('in-alerting:smartAlerts.applications.logMessages.selectLogMessageTitle')
                },
                isVisible: true
              });
            }}
          >
            {t('in-alerting:smartAlerts.applications.components.provideLogMessageSelectLogMessage')}
          </Button>
        </div>
      </FormGroup>
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
                let updatedForm = form.updateIn(['rule', 'message'], f =>
                  (f as Field<string>).setValue(value ?? '').setTouched(true)
                );
                //While Switching the BP to log and onDescription ValueChange update/reset the alert channels list to warning
                if (!warningThresholdValuePresent && !criticalThresholdValuePresent) {
                  updatedForm = updatedForm.updateIn(['alertChannels'], f =>
                    (f as any)
                      .setValue({
                        WARNING: selectedChannelsArray,
                        CRITICAL: []
                      })
                      .setTouched(true)
                  );
                }
                updateForm(updatedForm);
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
