/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import { Toggle, CarbonDropdown } from '@instana/components';

import {
  putUsersField,
  putUserPercentageField,
  numberOfUsersDefault,
  ImpactMeasurementMethods,
  percentageOfUserDefault
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { getValueRoundedToDecimals, round } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';
import toogleLocals from 'in-alerting/smart-alerts/components/dialog/advanced/Toogle.mless';

export default function ConfigureUserImpact({ form, onChange, updateForm }) {
  const timeThresholdForm = form.get('timeThreshold');
  const impactMeasurementMethod = timeThresholdForm.get('impactMeasurementMethod')?.value;
  const alertByPercentageOfUsersChecked = timeThresholdForm.containsKey('userPercentage');
  const alertByNumberOfUsersChecked = timeThresholdForm.containsKey('users');

  const options = [
    {
      label: t(
        'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodAggregated'
      ),
      value: ImpactMeasurementMethods.AGGREGATED
    },
    {
      label: t(
        'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodPerWindow'
      ),
      value: ImpactMeasurementMethods.PER_WINDOW
    }
  ];

  const onSelect = ({ selectedItem }) => {
    onChange(['timeThreshold', 'impactMeasurementMethod'], field =>
      field.setValue(selectedItem?.value).setTouched(true)
    );
  };

  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" noIcon>
        <label>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethod')}
        </label>
        <div className={locals.configureSingleControlWrapper}>
          <div>
            <CarbonDropdown
              id="dropdown_impact"
              hideLabel
              label={t(
                'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodSelect'
              )}
              size="sm"
              titleText={t(
                'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodSelect'
              )}
              selectedItem={impactMeasurementMethod && options?.find?.(opt => opt.value === impactMeasurementMethod)}
              items={options}
              itemToString={item => item?.label ?? ''}
              onChange={onSelect}
            />
          </div>
        </div>
      </AlertThresholdConfigItemContainer>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" noIcon>
        <div>
          {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfImpactedUsersThreshold')}
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
                min={1}
                name="users"
                value={timeThresholdForm.get('users')?.value ?? ''}
                placeholder={numberOfUsersDefault}
                onChange={e =>
                  onChange(['timeThreshold', 'users'], field =>
                    field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
                  )
                }
                step={1}
                disabled={!alertByNumberOfUsersChecked}
              />
            </FormGroup>
          </div>
          <Toggle
            name="alertByNumberOfUsersChecked"
            className={classNames({
              [locals.toggle]: true,
              [toogleLocals.toggleDialogUsage]: true
            })}
            checked={alertByNumberOfUsersChecked}
            onToggle={() => {
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
        <div className={locals.configureImpactControlsWrapper}>
          {timeThresholdForm.containsKey('users') && (
            <div className={locals.errorMessageBelowInput}>
              <TouchedMessages field={timeThresholdForm.get('users')} />
            </div>
          )}
        </div>
      </AlertThresholdConfigItemContainer>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" noIcon>
        <div>
          {t(
            'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigPercentageOfImpactedUsersThreshold'
          )}
        </div>
        <div className={locals.configureImpactControlsWrapper}>
          <div className={locals.operatorLabel}>
            {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigAtLeast')}
          </div>
          <div>
            <FormGroup className={locals.formGroup} withoutBottomMargin>
              <Label>
                {t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigPercentageOfUsers')}
              </Label>
              <Input
                className={locals.input}
                type="number"
                min={1}
                max={100}
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
                step={1}
                disabled={!alertByPercentageOfUsersChecked}
              />
            </FormGroup>
          </div>
          <Toggle
            name={'alertByPercentageOfImpactedUsersEnabled'}
            className={classNames({
              [locals.toggle]: true,
              [toogleLocals.toggleDialogUsage]: true
            })}
            checked={alertByPercentageOfUsersChecked}
            onToggle={() => {
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
        <div className={locals.configureImpactControlsWrapper}>
          {timeThresholdForm.containsKey('userPercentage') && (
            <div className={locals.errorMessageBelowInput}>
              <TouchedMessages field={timeThresholdForm.get('userPercentage')} />
            </div>
          )}
        </div>
      </AlertThresholdConfigItemContainer>
    </>
  );
}

ConfigureUserImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
