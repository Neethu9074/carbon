/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureTraceImpact({ form, onChange }) {
  const timeThresholdForm = form.get('timeThreshold');

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
    </>
  );
}

ConfigureTraceImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
