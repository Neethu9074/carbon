/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  putUsersField,
  putUserPercentageField,
  numberOfUsersDefault,
  percentageOfUserDefault
} from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/form';
import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { getValueRoundedToDecimals, round } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';

export default function ConfigureUserImpact({ form, onChange, updateForm }) {
  const timeThresholdForm = form.get('timeThreshold');
  const alertByPercentageOfUsersChecked = timeThresholdForm.containsKey('userPercentage');
  const alertByNumberOfUsersChecked = timeThresholdForm.containsKey('users');

  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" noIcon>
        <div>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfRequestsThreshold')}
        </div>
        <div className={locals.configureImpactControlsWrapper}>
          <div className={locals.operatorLabel}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigAtLeast')}
          </div>
          <div>
            <FormGroup className={locals.formGroup} withoutBottomMargin>
              <Label>{t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfUsers')}</Label>
              <Input
                className={locals.input}
                type="number"
                min="1"
                name="users"
                value={timeThresholdForm.get('users')?.value ?? ''}
                placeholder={numberOfUsersDefault}
                onChange={e =>
                  onChange(['timeThreshold', 'users'], field =>
                    field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
                  )
                }
                step="1"
                disabled={!alertByNumberOfUsersChecked}
              />
            </FormGroup>
          </div>
          <Toggle
            name="alertByNumberOfUsersChecked"
            className={locals.toggle}
            checked={alertByNumberOfUsersChecked}
            onChange={() => {
              let updatedTimeThresholdForm = timeThresholdForm;
              if (!alertByNumberOfUsersChecked && alertByPercentageOfUsersChecked) {
                updatedTimeThresholdForm = putUsersField(updatedTimeThresholdForm);
              } else if (alertByNumberOfUsersChecked) {
                updatedTimeThresholdForm = timeThresholdForm.remove('users');
                updatedTimeThresholdForm = putUserPercentageField(
                  updatedTimeThresholdForm,
                  updatedTimeThresholdForm.get('userPercentage')?.value
                );
              } else {
                updatedTimeThresholdForm = timeThresholdForm.remove('userPercentage');
                updatedTimeThresholdForm = putUsersField(updatedTimeThresholdForm);
              }
              updateForm(form.put('timeThreshold', updatedTimeThresholdForm));
            }}
          />
        </div>
      </AlertThresholdConfigItemContainer>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" noIcon>
        <div>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigPercentageOfRequestsThreshold')}
        </div>
        <div className={locals.configureImpactControlsWrapper}>
          <div className={locals.operatorLabel}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigAtLeast')}
          </div>
          <div>
            <FormGroup className={locals.formGroup} withoutBottomMargin>
              <Label>{t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfUsers')}</Label>
              <Input
                className={locals.input}
                type="number"
                min="1"
                max="100"
                value={
                  timeThresholdForm.containsKey('userPercentage')
                    ? getValueRoundedToDecimals(timeThresholdForm.get('userPercentage').value, true)
                    : ''
                }
                name={'userPercentage'}
                placeholder={getValueRoundedToDecimals(percentageOfUserDefault, true)}
                onChange={e => {
                  onChange(['timeThreshold', 'userPercentage'], field =>
                    field
                      .setValue(e.target.value !== '' ? round(Math.abs(e.target.value) / 100, 3) : '')
                      .setTouched(true)
                  );
                }}
                step="1"
                disabled={!alertByPercentageOfUsersChecked}
              />
            </FormGroup>
          </div>
          <Toggle
            name={'alertByPercentageOfImpactedUsersEnabled'}
            className={locals.toggle}
            checked={alertByPercentageOfUsersChecked}
            onChange={() => {
              let updatedTimeThresholdForm = timeThresholdForm;
              if (!alertByPercentageOfUsersChecked && alertByNumberOfUsersChecked) {
                updatedTimeThresholdForm = putUserPercentageField(updatedTimeThresholdForm);
              } else if (alertByPercentageOfUsersChecked) {
                updatedTimeThresholdForm = timeThresholdForm.remove('userPercentage');
                updatedTimeThresholdForm = putUsersField(
                  updatedTimeThresholdForm,
                  updatedTimeThresholdForm.get('users')?.value
                );
              } else {
                updatedTimeThresholdForm = timeThresholdForm.remove('users');
                updatedTimeThresholdForm = putUserPercentageField(updatedTimeThresholdForm);
              }
              updateForm(form.put('timeThreshold', updatedTimeThresholdForm));
            }}
          />
        </div>
      </AlertThresholdConfigItemContainer>
      {timeThresholdForm.containsKey('userPercentage') && (
        <TouchedMessages field={timeThresholdForm.get('userPercentage')} />
      )}
      {timeThresholdForm.containsKey('users') && <TouchedMessages field={timeThresholdForm.get('users')} />}
    </>
  );
}

ConfigureUserImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
