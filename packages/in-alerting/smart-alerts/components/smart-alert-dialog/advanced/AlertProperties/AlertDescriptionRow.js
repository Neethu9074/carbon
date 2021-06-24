/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

export default function AlertDescriptionRow({ form, onChange, trackDescriptionChanged, getDescriptionPlaceholder }) {
  return (
    <AlertSection
      titleHtmlFor="description"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesDescription')}
      icon="lib_help_error_error_outline"
    >
      <AlertPropertiesTextarea
        name="description"
        id="description"
        rows="3"
        onChange={e => {
          onChange(['description'], field => field.setValue(e.target.value || '').setTouched(true));
          trackDescriptionChanged?.();
        }}
        placeholder={getDescriptionPlaceholder(form)}
        formField={form.get('description')}
      />
    </AlertSection>
  );
}

AlertDescriptionRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  trackDescriptionChanged: PropTypes.func
};
