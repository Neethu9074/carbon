/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertSection from 'in-alerting/components/AlertSection';
import Toggle from 'in-components/form/Toggle';
import { t } from 'in-i18n';

export default function TriggersIncidentRow({ form, trackTriggerChanged, onChange }) {
  return (
    <AlertSection
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
      icon="lib_events_incident"
    >
      <Toggle
        checked={Boolean(form.get('triggering').value)}
        onChange={e => {
          onChange(['triggering'], field => field.setValue(e.target.checked || '').setTouched(true));
          trackTriggerChanged?.();
        }}
      />
    </AlertSection>
  );
}

TriggersIncidentRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  trackTriggerChanged: PropTypes.func
};
