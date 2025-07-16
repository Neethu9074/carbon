/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { MapForm } from 'formalistic';
import { Field } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { Stack } from '@instana/components';

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
  tearSheetView?: boolean;
}
export default function ProvideStatusCode({ form, updateForm, tearSheetView = false }: ProvideStatusCodeProps) {
  return (
    <div className={classNames({ [locals.container]: !tearSheetView })}>
      {form
        .get('rule')
        .get('value')
        .map((field: Field<string>) => (
          <FormGroup>
            <Stack>
              {/* The label does not need to be displayed in tearsheet view and will only appear in dialogs.
               */}
              {!tearSheetView && (
                <Label htmlFor="ruleValue" hasError={!field.valid && field.touched}>
                  {t('in-alerting:smartAlerts.eum.components.provideStatusCodeStatusCode')}
                </Label>
              )}
              <span className={classNames({ [locals.smallWidth]: tearSheetView })}>
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
              </span>
              <TouchedMessages field={field} />
            </Stack>
          </FormGroup>
        ))}
    </div>
  );
}

function getOperatorForStatusCode(statusCode: string) {
  return statusCode && (statusCode === '-1' || statusCode.length === 3) ? operators.EQUALS : operators.STARTS_WITH;
}
