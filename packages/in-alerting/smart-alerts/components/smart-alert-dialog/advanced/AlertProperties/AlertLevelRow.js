/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertSection from 'in-alerting/components/AlertSection';
import Select from 'in-components/form/Select/Select';
import { t } from 'in-i18n';

const severityWarning = 5;
const severityCritical = 10;

const severitySelectOptions = {
  [severityWarning]: {
    value: severityWarning,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesWarning')
  },
  [severityCritical]: {
    value: severityCritical,
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesCritical')
  }
};

export default function AlertLevelRow({ form, onChange, trackAlertLevelChanged }) {
  const severity = Number(form.get('severity').value);

  return (
    <AlertSection
      titleHtmlFor="severity"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertLevel')}
      icon={severity <= 5 ? 'lib_events_warning' : 'lib_events_critical'}
    >
      <Select
        name="severity"
        id="severity"
        onChange={e => {
          onChange(['severity'], field => field.setValue(e.target.value).setTouched(true));
          trackAlertLevelChanged?.();
        }}
        defaultValue={severitySelectOptions[severity].value}
      >
        {Object.values(severitySelectOptions).map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </AlertSection>
  );
}

AlertLevelRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  trackAlertLevelChanged: PropTypes.func
};
