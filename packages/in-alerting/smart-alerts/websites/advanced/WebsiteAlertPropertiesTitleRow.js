/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import { websitesAlertingAdditionalPropsTitleChanged } from 'in-alerting/smart-alerts/websites/tracker';
import { getTitlePlaceholder } from 'in-alerting/smart-alerts/websites/form/formUtils';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

export default function WebsiteAlertPropertiesTitleRow({ form, onChange }) {
  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <AlertPropertiesTextarea
        name="name"
        id="name"
        value={form.get('name').value}
        onChange={e => {
          onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
          websitesAlertingAdditionalPropsTitleChanged();
        }}
        hasError={hasError(form.get('name'))}
        maxLength={256}
        placeholder={getTitlePlaceholder(form)}
      />
    </AlertSection>
  );
}

function hasError(field) {
  return !field.valid && field.touched;
}

WebsiteAlertPropertiesTitleRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.any
};
