/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import AlertSection from 'in-alerting/components/AlertSection';
import { hasError } from 'in-services/util/result';
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
        value={form.get('description').value}
        onChange={e => {
          onChange(['description'], field => field.setValue(e.target.value || '').setTouched(true));
          trackDescriptionChanged?.();
        }}
        hasError={hasError(form.get('description'))}
        maxLength={65536}
        placeholder={getDescriptionPlaceholder(form)}
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
