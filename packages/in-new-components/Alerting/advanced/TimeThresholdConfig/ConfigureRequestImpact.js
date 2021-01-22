/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureRequestImpact({ form, onChange }) {
  const timeThresholdForm = form.get('timeThreshold');

  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_application_boundary_inbound_calls" noIcon>
        <div>{t('in-new-components:alerting.advanced.timeThresholdConfigNumberOfRequestsThreshold')}</div>
        <div className={locals.configureImpactControlsWrapper}>
          <div className={locals.operatorLabel}>
            {t('in-new-components:alerting.advanced.timeThresholdConfigAtLeast')}
          </div>
          <div>
            <FormGroup className={locals.formGroup} withoutBottomMargin>
              <Label>{t('in-new-components:alerting.advanced.timeThresholdConfigNumberOfRequests')}</Label>
              {timeThresholdForm.get('requests').map(({ value }) => (
                <Input
                  className={locals.input}
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
            </FormGroup>
          </div>
        </div>
      </AlertThresholdConfigItemContainer>
      <TouchedMessages field={timeThresholdForm.get('requests')} />
    </>
  );
}

ConfigureRequestImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
