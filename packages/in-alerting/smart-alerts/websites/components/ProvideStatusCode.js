/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/websites/form/ruleFormData';
import { websitesAlertingStatusCodeChanged } from 'in-alerting/smart-alerts/websites/tracker';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { operators } from 'in-analyze/applicationFilter';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/ProvideJsError.mless';

export default function ProvideStatusCode({ form, mode, updateForm }) {
  return (
    <div className={locals.container}>
      {form
        .get('rule')
        .get('value')
        .map(field => (
          <FormGroup>
            <Label htmlFor={'ruleValue'} hasError={!field.valid && field.touched}>
              {t('in-alerting:smartAlerts.websites.components.provideStatusCodeStatusCode')}
            </Label>
            <ComboBox
              name={'ruleValue'}
              value={field.value}
              options={ruleStatusCodeValueOptions}
              onChange={e => {
                websitesAlertingStatusCodeChanged({ mode });
                updateForm(
                  form
                    .updateIn(['rule', 'value'], f => f.setValue((e && e.value) || '').setTouched(true))
                    .updateIn(['rule', 'operator'], f => f.setValue(getOperatorForStatusCode(e.value)).setTouched(true))
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                    .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                );
              }}
              defaultValue="4"
              clearable={false}
              searchable
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
    </div>
  );
}

ProvideStatusCode.propTypes = {
  form: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired
};

function getOperatorForStatusCode(statusCode) {
  return statusCode && statusCode.length === 3 ? operators.EQUALS : operators.STARTS_WITH;
}
