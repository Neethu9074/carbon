/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { CarbonDropdown } from '@instana/components';

import {
  putUsersField,
  putUserPercentageField,
  numberOfUsersDefault,
  ImpactMeasurementMethods,
  percentageOfUserDefault
} from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/form';
import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import UserImpactInput from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/UserImpactInput';
import { getValueRoundedToDecimals, round } from 'in-alerting/smart-alerts/components/utils/formatUtils';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { t } from 'in-i18n';

const options = [
  {
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodAggregated'),
    value: ImpactMeasurementMethods.AGGREGATED
  },
  {
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethodPerWindow'),
    value: ImpactMeasurementMethods.PER_WINDOW
  }
];

const PERCENTAGE_OF_USERS = 'percentageOfUsers';
export const NUMBER_OF_USERS = 'numberOfUsers';
export default function ConfigureUserImpact({ form, onChange, updateForm }) {
  const timeThresholdForm = form.get('timeThreshold');
  const impactMeasurementMethod = timeThresholdForm.get('impactMeasurementMethod')?.value;
  const alertByPercentageOfUsersChecked = timeThresholdForm.containsKey('userPercentage');
  const alertByNumberOfUsersChecked = timeThresholdForm.containsKey('users');

  const onSelect = ({ selectedItem }) => {
    onChange(['timeThreshold', 'impactMeasurementMethod'], field =>
      field.setValue(selectedItem?.value).setTouched(true)
    );
  };

  return (
    <>
      <AlertThresholdConfigItemContainer isTearSheet noIcon isTwoColumns>
        <AlertTypography
          variant={'body-regular'}
          color={'color900'}
          content={t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigImpactEvaluationMethod')}
          noMargin
        />
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
      </AlertThresholdConfigItemContainer>
      <UserImpactInput
        label={t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigNumberOfImpactedUsersThreshold'
        )}
        toggleName="alertByNumberOfUsersChecked"
        toggleChecked={alertByNumberOfUsersChecked}
        onToggle={onToggleCallback(NUMBER_OF_USERS)}
        inputValue={timeThresholdForm.get('users')?.value ?? ''}
        inputName="users"
        inputPlaceholder={numberOfUsersDefault}
        inputOnChange={e =>
          onChange(['timeThreshold', 'users'], field =>
            field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
          )
        }
        inputDisabled={!alertByNumberOfUsersChecked}
        postLabel={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.numberOfUserImpactPostLabel')}
        inputType={NUMBER_OF_USERS}
        timeThresholdForm={timeThresholdForm}
      />
      <UserImpactInput
        label={t(
          'in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigPercentageOfImpactedUsersThreshold'
        )}
        toggleName={'alertByPercentageOfImpactedUsersEnabled'}
        toggleChecked={alertByPercentageOfUsersChecked}
        onToggle={onToggleCallback(PERCENTAGE_OF_USERS)}
        inputMax={100}
        inputValue={
          timeThresholdForm.containsKey('userPercentage')
            ? getValueRoundedToDecimals(timeThresholdForm.get('userPercentage').value, true)
            : ''
        }
        inputName={'userPercentage'}
        inputPlaceholder={getValueRoundedToDecimals(percentageOfUserDefault, true)}
        inputOnChange={e => {
          onChange(['timeThreshold', 'userPercentage'], field =>
            field.setValue(e.target.value !== '' ? round(Math.abs(e.target.value) / 100, 3) : '').setTouched(true)
          );
        }}
        inputDisabled={!alertByPercentageOfUsersChecked}
        postLabel={t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.percentageOfUserImpactPostLabel')}
        inputType={PERCENTAGE_OF_USERS}
        timeThresholdForm={timeThresholdForm}
      />
    </>
  );

  function onToggleCallback(inputType) {
    if (inputType == PERCENTAGE_OF_USERS) {
      return () => {
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
      };
    } else {
      return () => {
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
      };
    }
  }
}

ConfigureUserImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
