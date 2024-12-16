/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import AlertTypography from 'in-alerting/components/AlertTypography';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureTraceImpact({ form, onChange }) {
  const timeThresholdForm = form.get('timeThreshold');
  const hasError = !timeThresholdForm.get('requests').valid && timeThresholdForm.get('requests').touched;
  return (
    <>
      <AlertThresholdConfigItemContainer isTearSheet noIcon>
        <AlertTypography
          variant={'body-regular'}
          color={'color900'}
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAfter')}
          noMargin
        />
        <div>
          {timeThresholdForm.get('requests').map(({ value }) => (
            <Input
              className={locals.inputTearSheet}
              type="number"
              min="1"
              name="requests"
              value={value}
              hasError={hasError}
              onChange={e =>
                onChange(['timeThreshold', 'requests'], field =>
                  field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
                )
              }
              step="1"
            />
          ))}
        </div>
        <AlertTypography
          variant={'body-small'}
          color={'color600'}
          content={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.tracesImpacted')}
          noMargin
        />
      </AlertThresholdConfigItemContainer>
      <div className={locals.traceImpactValidationContainer}>
        {timeThresholdForm.containsKey('requests') && (
          <div className={locals.traceImpactValidation}>
            <TouchedMessages field={timeThresholdForm.get('requests')} />
          </div>
        )}
      </div>
    </>
  );
}

ConfigureTraceImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
