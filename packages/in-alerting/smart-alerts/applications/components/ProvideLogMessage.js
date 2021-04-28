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
} from 'in-alerting/smart-alerts/applications/tracker';
import {
  ruleLogMessageOperatorOptions,
  ruleLogLevelOptions
} from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import LogMessagesList from 'in-alerting/smart-alerts/applications/components/LogMessagesList';
import DebouncedTextArea from 'in-components/form/TextArea/DebouncedTextArea';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { propTypeTimeConfig } from 'in-stores/time/config';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import ComboBox from 'in-components/ComboBox';
import Button from 'in-new-components/Button';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage.mless';

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
            {t('in-alerting:smartAlerts.applications.logMessages.selectLogMessageText')}
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
                      applicationId={form.get('applicationId')?.value}
                      applicationBoundaryScope={form.get('boundaryScope').value}
                      timeConfig={timeConfig}
                      onLogMessageSelect={(message, level) => {
                        applicationsAlertingLogMsgSelected({ message, mode });
                        updateForm(
                          form
                            .updateIn(['rule', 'message'], f => f.setValue(message).setTouched(true))
                            .updateIn(['rule', 'operator'], field => field.setValue(operators.EQUALS))
                            .updateIn(['rule', 'level'], f => f.setValue(level).setTouched(true))
                        );
                      }}
                      slideOut={() => onSelectLogMessage({ isVisible: false })}
                    />
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
      {levelField.map(field => (
        <FormGroup>
          <Label htmlFor={'ruleLevel'} hasError={!field.valid && field.touched}>
            {t('in-alerting:smartAlerts.applications.components.provideLogMessageLogLevel')}
          </Label>
          <ComboBox
            name={'ruleLevel'}
            value={field.value}
            options={ruleLogLevelOptions}
            onChange={e => {
              applicationsAlertingLogLevelChanged({ mode });
              const newLevel = (e && e.value) || '';
              updateForm(form.updateIn(['rule', 'level'], f => f.setValue(newLevel).setTouched(true)));
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
            {t('in-alerting:smartAlerts.applications.components.provideLogMessageErrorMessage')}
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
                updateForm(form.updateIn(['rule', 'message'], f => f.setValue(value ?? '').setTouched(true)));
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
