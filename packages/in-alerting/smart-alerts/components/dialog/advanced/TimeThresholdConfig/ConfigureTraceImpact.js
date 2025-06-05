/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureTraceImpact({ form, onChange }) {
  const timeThresholdForm = form.get('timeThreshold');

  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_application_boundary_inbound_calls" noIcon>
        <div>{t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfTracesThreshold')}</div>
        <div className={locals.configureImpactControlsWrapper}>
          <div className={locals.operatorLabel}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigAtLeast')}
          </div>
          <div>
            <FormGroup className={locals.formGroup} withoutBottomMargin>
              <Label>
                {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfTraces')}
              </Label>
              {timeThresholdForm.get('requests').map(({ value }) => (
                <Input
                  className={locals.input}
                  type="number"
                  min={1}
                  name="requests"
                  value={value}
                  onChange={e =>
                    onChange(['timeThreshold', 'requests'], field =>
                      field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
                    )
                  }
                  step={1}
                />
              ))}
            </FormGroup>
          </div>
        </div>
        <div className={locals.configureImpactControlsWrapper}>
          {timeThresholdForm.containsKey('requests') && (
            <div className={locals.errorMessageBelowInput}>
              <TouchedMessages field={timeThresholdForm.get('requests')} />
            </div>
          )}
        </div>
      </AlertThresholdConfigItemContainer>
    </>
  );
}

ConfigureTraceImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
