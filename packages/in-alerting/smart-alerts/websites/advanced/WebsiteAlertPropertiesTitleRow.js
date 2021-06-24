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
        onChange={e => {
          onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
          websitesAlertingAdditionalPropsTitleChanged();
        }}
        placeholder={getTitlePlaceholder(form)}
        formField={form.get('name')}
      />
    </AlertSection>
  );
}

WebsiteAlertPropertiesTitleRow.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.any
};
