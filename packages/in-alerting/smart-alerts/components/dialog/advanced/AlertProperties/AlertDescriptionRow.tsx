/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

interface AlertDescriptionRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getDescriptionPlaceholder: (form: MapForm<any>) => string;
}

export default function AlertDescriptionRow({ form, onChange, getDescriptionPlaceholder }: AlertDescriptionRowProps) {
  return (
    <AlertSection
      titleHtmlFor="description"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesDescription')}
      icon="lib_help_error_error_outline"
    >
      <AlertPropertiesTextarea
        name="description"
        id="description"
        rows={3}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
          onChange(['description'], (field: Item) => {
            return (field as Field<string>).setValue(e.target.value || '').setTouched(true);
          });
        }}
        placeholder={getDescriptionPlaceholder(form)}
        formField={form.get('description')}
      />
    </AlertSection>
  );
}
