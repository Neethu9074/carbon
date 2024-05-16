/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Stack } from '@instana/components';

import { ruleStatusCodeValueApplicationOptions as ruleStatusCodeValueOptions } from 'in-alerting/smart-alerts/components/utils/ruleStatusCodeValueOptions';
import StatusCodeRangeSelection from 'in-alerting/smart-alerts/applications/components/StatusCodeRangeSelection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/ProvideLogMessage.mless';

export default function ProvideStatusCode({ form, updateForm, tearSheetView }) {
  const selection = getStatusCodeFieldValue(form);
  const field = form.get('rule').get('statusCode');
  const startField = field.get('statusCodeStart');
  const endField = field.get('statusCodeEnd');

  return (
    <div className={classNames({ [locals.container]: !tearSheetView })}>
      <FormGroup>
        <Stack>
          {/* The label does not need to be displayed in tearsheet view and will only appear in dialogs.
           */}
          {!tearSheetView && (
            <Label htmlFor="ruleValue">
              {t('in-alerting:smartAlerts.applications.components.provideStatusCodeStatusCode')}
            </Label>
          )}
          <span className={classNames({ [locals.smallWidth]: tearSheetView })}>
            <ComboBox
              id="ruleValue"
              name="ruleValue"
              value={selection}
              options={ruleStatusCodeValueOptions}
              onChange={e => {
                if (e.value === 'custom') {
                  updateForm(
                    form.updateIn(['rule', 'statusCode', 'isCustomRange'], f => f.setValue(true).setTouched(true))
                  );
                  return;
                }

                updateForm(
                  form
                    .updateIn(['rule', 'statusCode', 'statusCodeStart'], f =>
                      f.setValue(Number(getStartForStatusCode(e.value))).setTouched(true)
                    )
                    .updateIn(['rule', 'statusCode', 'statusCodeEnd'], f =>
                      f.setValue(Number(getEndForStatusCode(e.value))).setTouched(true)
                    )
                    .updateIn(['rule', 'statusCode', 'isCustomRange'], f => f.setValue(false).setTouched(true))
                );
              }}
              isClearable={false}
            />
          </span>
          {selection === 'custom' && (
            <StatusCodeRangeSelection
              tearSheetView={tearSheetView}
              startField={startField}
              endField={endField}
              onStartSelectionUpdate={start =>
                updateForm(
                  form.updateIn(['rule', 'statusCode', 'statusCodeStart'], f =>
                    f.setValue(start ? Number(start) : undefined).setTouched(true)
                  )
                )
              }
              onEndSelectionUpdate={end =>
                updateForm(
                  form.updateIn(['rule', 'statusCode', 'statusCodeEnd'], f =>
                    f.setValue(end ? Number(end) : undefined).setTouched(true)
                  )
                )
              }
            />
          )}
          <TouchedMessages field={field} />
        </Stack>
      </FormGroup>
    </div>
  );
}

ProvideStatusCode.propTypes = {
  form: PropTypes.object.isRequired,
  updateForm: PropTypes.func.isRequired,
  tearSheetView: PropTypes.bool
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
  const field = form.get('rule').get('statusCode');
  const statusCodeStart = field.get('statusCodeStart');
  const statusCodeEnd = field.get('statusCodeEnd');
  const isCustomRange = field.get('isCustomRange');

  if (isCustomRange.value) {
    return 'custom';
  }

  if (statusCodeStart.value === statusCodeEnd.value) {
    return `${statusCodeStart.value}`;
  }

  if (statusCodeEnd.value - statusCodeStart.value === 99) {
    return `${statusCodeStart.value / 100}`;
  }

  return 'custom';
}
