/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

export default function AlertPropertiesTitleRow({ form, onChange, getTitlePlaceholder }) {
  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <AlertPropertiesTextarea
        name="name"
        id="name"
        onChange={e => {
          onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
        }}
        placeholder={getTitlePlaceholder(form)}
        formField={form.get('name')}
      />
    </AlertSection>
  );
}

AlertPropertiesTitleRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.any,
  getTitlePlaceholder: PropTypes.func.isRequired
};
