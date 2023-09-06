/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Toggle } from '@instana/components';

import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

export default function TriggersIncidentRow({ form, onChange }) {
  if (form.get('triggering')) {
    return (
      <AlertSection
        title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTriggersIncident')}
        icon="lib_events_incident"
      >
        <Toggle
          checked={Boolean(form.get('triggering')?.value)}
          onChange={e => {
            onChange(['triggering'], field => field.setValue(e.target.checked || false).setTouched(true));
          }}
        />
      </AlertSection>
    );
  }
  return null;
}

TriggersIncidentRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
