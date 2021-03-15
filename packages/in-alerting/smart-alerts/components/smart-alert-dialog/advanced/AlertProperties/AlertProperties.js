/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import PropContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/PropContainer';
import TextArea from 'in-components/form/TextArea';
import Toggle from 'in-components/form/Toggle';
import ComboBox from 'in-components/ComboBox';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertProperties.mless';

const warningIndex = 0;
const severityWarning = 5;
const severityCritical = 10;

const severitySelectOptions = [
  { value: severityWarning, label: t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesWarning') },
  { value: severityCritical, label: t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesCritical') }
];

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  getTitlePlaceholder,
  onChange,
  trackAlertLevelChanged,
  trackDescriptionChanged,
  trackTitleChanged,
  trackTriggerChanged
}) {
  const severity = Number(form.get('severity').value);

  return (
    <>
      <PropContainer
        left={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
        right={
          <Input
            className={locals.textInput}
            name={'name'}
            value={form.get('name').value}
            onChange={e => {
              onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
              if (trackTitleChanged) {
                trackTitleChanged();
              }
            }}
            hasError={hasError(form.get('name'))}
            maxLength={256}
            placeholder={getTitlePlaceholder(form)}
          />
        }
      />
      <PropContainer
        icon={severity <= 5 ? 'lib_events_warning' : 'lib_events_critical'}
        left={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertLevel')}
        right={
          <ComboBox
            name={'severity'}
            value={form.get('severity').value}
            options={severitySelectOptions}
            onChange={({ value = '' }) => {
              onChange(['severity'], field => field.setValue(value).setTouched(true));
              if (trackAlertLevelChanged) {
                trackAlertLevelChanged();
              }
            }}
            defaultValue={severitySelectOptions[warningIndex].value}
            clearable={false}
          />
        }
      />
      <PropContainer
        icon="lib_events_incident"
        left={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
        right={
          <Toggle
            checked={Boolean(form.get('triggering').value)}
            onChange={e => {
              onChange(['triggering'], field => field.setValue(e.target.checked || '').setTouched(true));

              if (trackTriggerChanged) {
                trackTriggerChanged();
              }
            }}
          />
        }
      />
      <PropContainer
        icon="lib_help_error_error_outline"
        left={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesDescription')}
        right={
          <TextArea
            className={locals.textArea}
            name={'description'}
            rows="3"
            value={form.get('description').value}
            onChange={e => {
              onChange(['description'], field => field.setValue(e.target.value || '').setTouched(true));
              if (trackDescriptionChanged) {
                trackDescriptionChanged();
              }
            }}
            hasError={hasError(form.get('description'))}
            maxLength={65536}
            placeholder={getDescriptionPlaceholder(form)}
          />
        }
      />
    </>
  );
}

AlertProperties.propTypes = {
  form: PropTypes.object.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  getTitlePlaceholder: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  trackAlertLevelChanged: PropTypes.func,
  trackDescriptionChanged: PropTypes.func,
  trackTitleChanged: PropTypes.func,
  trackTriggerChanged: PropTypes.func
};

function hasError(field) {
  return !field.valid && field.touched;
}
