/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { ruleMetricNameOptions } from 'in-alerting/smart-alerts/mobileApp/form/ruleFormData';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ComboBox, { Option } from 'in-components/ComboBox';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

interface ProvideCrashProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function ProvideCrash({ form, updateForm }: ProvideCrashProps) {
  const metricNameField = form.get('rule').get('metricName');

  return (
    <FormGroup>
      <Label htmlFor="metricValue" hasError={!metricNameField.valid && metricNameField.touched}>
        {t('in-alerting:smartAlerts.mobileApp.data.crashBlueprintSelectMetric')}
      </Label>
      <ComboBox
        id="metricValue"
        name="metricValue"
        value={metricNameField.value}
        options={ruleMetricNameOptions.crash}
        onChange={e => {
          updateForm(
            form.updateIn(['rule', 'metricName'], f =>
              (f as Field<string>).setValue((e as Option).value).setTouched(true)
            )
          );
        }}
        defaultValue="crashAffectedSessionRate"
        isClearable={false}
      />
      <TouchedMessages field={metricNameField} />
    </FormGroup>
  );
}
