/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Select } from '@instana/components';

import AlertSection from 'in-alerting/components/AlertSection';
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

interface AlertLevelRowProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
}

export default function AlertLevelRow({ form, onChange }: AlertLevelRowProps) {
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
          onChange(['severity'], (field: Item) => {
            return (field as Field<number>).setValue(Number(e.target.value)).setTouched(true);
          });
        }}
        defaultValue={severitySelectOptions[severity as keyof typeof severitySelectOptions].value}
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
