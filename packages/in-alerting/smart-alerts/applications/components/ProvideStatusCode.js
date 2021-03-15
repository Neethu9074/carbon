/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { applicationsAlertingStatusCodeChanged } from 'in-alerting/smart-alerts/applications/tracker';
import { ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/applications/form/ruleFormData';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage.mless';

export default function ProvideStatusCode({ form, mode, updateForm }) {
  return (
    <div className={locals.container}>
      {form
        .get('rule')
        .get('statusCodeStart')
        .map(field => (
          <FormGroup>
            <Label htmlFor={'ruleValue'} hasError={!field.valid && field.touched}>
              {t('in-alerting:smartAlerts.applications.components.provideStatusCodeStatusCode')}
            </Label>
            <ComboBox
              name={'ruleValue'}
              value={getStatusCodeFieldValue(form)}
              options={ruleStatusCodeValueOptions}
              onChange={e => {
                applicationsAlertingStatusCodeChanged({ mode });
                updateForm(
                  form
                    .updateIn(['rule', 'statusCodeStart'], f =>
                      f.setValue(Number(getStartForStatusCode(e.value))).setTouched(true)
                    )
                    .updateIn(['rule', 'statusCodeEnd'], f =>
                      f.setValue(Number(getEndForStatusCode(e.value))).setTouched(true)
                    )
                    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
                    .updateIn(['threshold', 'value'], f => f.setValue(null).setTouched(true)) // reset "old" value to ensure that we only call endpoints with the "new" threshold suggestion
                );
              }}
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

function getStartForStatusCode(statusCode) {
  if (statusCode?.length === 3) {
    return statusCode;
  } else if (statusCode?.length === 1) {
    return statusCode * 100;
  }
}

function getEndForStatusCode(statusCode) {
  if (statusCode?.length === 3) {
    return statusCode;
  } else if (statusCode?.length === 1) {
    return statusCode * 100 + 99;
  }
}

function getStatusCodeFieldValue(form) {
  const statusCodeStart = form.get('rule').get('statusCodeStart');
  const statusCodeEnd = form.get('rule').get('statusCodeEnd');

  if (statusCodeStart.value === statusCodeEnd.value) {
    return statusCodeStart.value;
  }
  return statusCodeStart.value / 100;
}
