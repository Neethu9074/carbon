/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import {
  applicationsAlertingLogMsgChanged,
  applicationsAlertingLogOperatorChanged,
  applicationsAlertingLogLevelChanged,
  applicationsAlertingLogMsgSelected,
  applicationsAlertingLogOpenMsgSelectView
} from 'in-applications/alerting/tracker';
import { ruleLogMessageOperatorOptions, ruleLogLevelOptions } from 'in-applications/alerting/form/ruleFormData';
import LogMessagesList from 'in-applications/alerting/components/LogMessagesList';
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import { modeAdvanced } from 'in-websites/alerting/constants';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { operators } from 'in-analyze/applicationFilter';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Button from 'in-new-components/Button/Button';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './ProvideLogMessage.mless';

export default function ProvideLogMessage({ form, timeConfig, onSelectLogMessage, mode, updateForm }) {
  const operatorField = form.get('rule').get('operator');
  const messageField = form.get('rule').get('message');
  const levelField = form.get('rule').get('level');

  return (
    <div className={locals.container}>
      <FormGroup>
        <div
          className={classNames({
            [locals.logMessageSelectAdvanceMode]: mode === modeAdvanced
          })}
        >
          <HelpText className={locals.helpText}>
            {t('in-applications:analyze.logMessages.selectLogMessageText')}
          </HelpText>
          <Button
            className={classNames({
              [locals.logMessageSelectButtonAdvanceMode]: mode === modeAdvanced
            })}
            onClick={() => {
              applicationsAlertingLogOpenMsgSelectView({ mode });
              onSelectLogMessage({
                slideInConfig: {
                  component: (
                    <LogMessagesList
                      applicationId={form.get('applicationId').value}
                      applicationBoundaryScope={form.get('boundaryScope').value}
                      timeConfig={timeConfig}
                      onLogMessageSelect={(message, level) => {
                        applicationsAlertingLogMsgSelected({ message, mode });
                        updateForm(
                          form
                            .updateIn(['rule', 'message'], f => f.setValue(message).setTouched(true))
                            .updateIn(['rule', 'operator'], field => field.setValue(operators.EQUALS))
                            .updateIn(['rule', 'level'], f => f.setValue(level).setTouched(true))
                            .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                            .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                        );
                      }}
                      slideOut={() => onSelectLogMessage({ isVisible: false })}
                    />
                  ),
                  title: t('in-applications:analyze.logMessages.selectLogMessageTitle')
                },
                isVisible: true
              });
            }}
          >
            Select Log Message
          </Button>
        </div>
      </FormGroup>
      {levelField.map(field => (
        <FormGroup>
          <Label htmlFor={'ruleLevel'} hasError={!field.valid && field.touched}>
            Log Level
          </Label>
          <ComboBox
            name={'ruleLevel'}
            value={field.value}
            options={ruleLogLevelOptions}
            onChange={e => {
              applicationsAlertingLogLevelChanged({ mode });
              const newLevel = (e && e.value) || '';
              updateForm(
                form
                  .updateIn(['rule', 'level'], f => f.setValue(newLevel).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
              );
            }}
            defaultValue={ruleLogLevelOptions[0].value}
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.map(field => (
        <FormGroup>
          <Label htmlFor={'ruleOperator'} hasError={!field.valid && field.touched}>
            Error Message
          </Label>
          <ComboBox
            name={'ruleOperator'}
            value={field.value}
            options={ruleLogMessageOperatorOptions}
            onChange={e => {
              applicationsAlertingLogOperatorChanged({ mode });
              const previousOperator = field.value;
              const newOperator = (e && e.value) || '';
              let newRuleValueValue = 'Any';
              if (previousOperator === operators.NOT_EMPTY) {
                newRuleValueValue = '';
              } else if (newOperator !== operators.NOT_EMPTY) {
                newRuleValueValue = messageField.value;
              }

              updateForm(
                form
                  .updateIn(['rule', 'operator'], f => f.setValue(newOperator).setTouched(true))
                  .updateIn(['rule', 'message'], f => f.setValue(newRuleValueValue).setTouched(true))
                  .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                  .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
              );
            }}
            defaultValue={ruleLogMessageOperatorOptions[0].value}
            clearable={false}
            searchable
          />
          <TouchedMessages field={field} />
        </FormGroup>
      ))}
      {operatorField.value !== operators.NOT_EMPTY &&
        messageField.map(field => (
          <FormGroup>
            <DebouncedTextArea
              name={'ruleMessage'}
              rows="3"
              value={field.value}
              onValueChange={value => {
                applicationsAlertingLogMsgChanged({ mode });
                updateForm(
                  form
                    .updateIn(['rule', 'message'], f => f.setValue(value ?? '').setTouched(true))
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

ProvideLogMessage.propTypes = {
  form: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired,
  onSelectLogMessage: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};
