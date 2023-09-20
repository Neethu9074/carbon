/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import AlertPropertiesTextarea from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesTextArea';
import AlertSection from 'in-alerting/components/AlertSection';
import { t } from 'in-i18n';

interface AlertPropertiesTitleRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  getTitlePlaceholder: (form: MapForm<any>) => string;
}
export default function AlertPropertiesTitleRow({ form, onChange, getTitlePlaceholder }: AlertPropertiesTitleRowProps) {
  return (
    <AlertSection
      titleHtmlFor="name"
      title={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesTitle')}
    >
      <AlertPropertiesTextarea
        name="name"
        id="name"
        onChange={e => {
          //@ts-expect-error
          onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
        }}
        placeholder={getTitlePlaceholder(form)}
        formField={form.get('name')}
      />
    </AlertSection>
  );
}
