/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/ProvideStatusCode.mless';

export default function ProvideStatusCode({ form, updateForm }) {
  return (
    <div className={locals.container}>
      {form
        .get('rule')
        .get('value')
        .map(field => (
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
                    .updateIn(['rule', 'value'], f => f.setValue((e && e.value) || '').setTouched(true))
                    .updateIn(['rule', 'operator'], f => f.setValue(getOperatorForStatusCode(e.value)).setTouched(true))
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

ProvideStatusCode.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getOperatorForStatusCode(statusCode) {
  return statusCode && statusCode.length === 3 ? operators.EQUALS : operators.STARTS_WITH;
}
