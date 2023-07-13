/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';
import { Field } from 'formalistic';
import React from 'react';

import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import TouchedMessages from 'in-components/form/TouchedMessages';
import ComboBox, { Option } from 'in-components/ComboBox';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode.mless';

interface ProvideStatusCodeProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
export default function ProvideStatusCode({ form, updateForm }: ProvideStatusCodeProps) {
  return (
    <div className={locals.container}>
      {form
        .get('rule')
        .get('value')
        .map((field: Field<string>) => (
          <FormGroup>
            <Label htmlFor="ruleValue" hasError={!field.valid && field.touched}>
              {t('in-alerting:smartAlerts.eum.components.provideStatusCodeStatusCode')}
            </Label>
            <ComboBox
              id="ruleValue"
              name="ruleValue"
              value={field.value}
              options={ruleStatusCodeValueOptions}
              onChange={e => {
                updateForm(
                  form
                    .updateIn(['rule', 'value'], f =>
                      (f as Field<string>).setValue((e && (e as Option).value) || '').setTouched(true)
                    )
                    .updateIn(['rule', 'operator'], f =>
                      f.setValue(getOperatorForStatusCode((e as Option).value)).setTouched(true)
                    )
                );
              }}
              defaultValue="4"
              isClearable={false}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </div>
  );
}

function getOperatorForStatusCode(statusCode: string) {
  return statusCode && statusCode.length === 3 ? operators.EQUALS : operators.STARTS_WITH;
}
