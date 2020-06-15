import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { getValueRoundedToDecimals, round } from 'in-new-components/Alerting/utils/formatUtils';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureUserImpact({ form, onChange, updateForm }) {
  const timeThresholdForm = form.get('timeThreshold');
  const hiddenFieldsForm = form.get('hiddenFields');

  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" hasExtraColumnOnRight>
        <div className={locals.operatorLabel}>At least</div>
        <div>
          <FormGroup className={locals.formGroup} withoutBottomMargin>
            <Label># of Users</Label>
            {timeThresholdForm.get('users').map(({ value }) => (
              <Input
                className={locals.input}
                type="number"
                min="1"
                name="users"
                value={value}
                onChange={e =>
                  onChange(['timeThreshold', 'users'], field =>
                    field.setValue(e.target.value !== '' ? Math.abs(e.target.value) : '').setTouched(true)
                  )
                }
                step="1"
                disabled={!hiddenFieldsForm.get('alertByNumberOfImpactedUsersEnabled').value}
              />
            ))}
          </FormGroup>
        </div>
        {hiddenFieldsForm.get('alertByNumberOfImpactedUsersEnabled').map(({ value }) => (
          <Toggle
            name="alertByNumberOfImpactedUsersEnabled"
            className={locals.toggle}
            checked={value}
            onChange={() => {
              const _value = !value;
              const alertByPercentageEnabled = hiddenFieldsForm.get('alertByPercentageOfImpactedUsersEnabled').value;

              let updatedForm = form
                .updateIn(['hiddenFields', 'alertByPercentageOfImpactedUsersEnabled'], f =>
                  f.setValue((!_value && !alertByPercentageEnabled) || alertByPercentageEnabled).setTouched(true)
                )
                .updateIn(['hiddenFields', 'alertByNumberOfImpactedUsersEnabled'], f =>
                  f.setValue(_value).setTouched(true)
                );

              updateForm(updatedForm);
            }}
          />
        ))}
      </AlertThresholdConfigItemContainer>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted" hasExtraColumnOnRight>
        <div className={locals.operatorLabel}>At least</div>
        <div>
          <FormGroup className={locals.formGroup} withoutBottomMargin>
            <Label>% of Users</Label>
            {timeThresholdForm.get('userPercentage').map(({ value }) => (
              <Input
                className={locals.input}
                type="number"
                min="1"
                max="100"
                value={getValueRoundedToDecimals(value, true)}
                name={'userPercentage'}
                onChange={e =>
                  onChange(['timeThreshold', 'userPercentage'], field =>
                    field
                      .setValue(e.target.value !== '' ? round(Math.abs(e.target.value) / 100, 3) : '')
                      .setTouched(true)
                  )
                }
                step="1"
                disabled={!hiddenFieldsForm.get('alertByPercentageOfImpactedUsersEnabled').value}
              />
            ))}
          </FormGroup>
        </div>
        {hiddenFieldsForm.get('alertByPercentageOfImpactedUsersEnabled').map(({ value }) => (
          <Toggle
            name={'alertByPercentageOfImpactedUsersEnabled'}
            className={locals.toggle}
            checked={value}
            onChange={() => {
              const _value = !value;
              const alertByNumberEnabled = hiddenFieldsForm.get('alertByNumberOfImpactedUsersEnabled').value;

              const updatedForm = form
                .updateIn(['hiddenFields', 'alertByNumberOfImpactedUsersEnabled'], f =>
                  f.setValue((!_value && !alertByNumberEnabled) || alertByNumberEnabled).setTouched(true)
                )
                .updateIn(['hiddenFields', 'alertByPercentageOfImpactedUsersEnabled'], f =>
                  f.setValue(_value).setTouched(true)
                );

              updateForm(updatedForm);
            }}
          />
        ))}
      </AlertThresholdConfigItemContainer>
      <TouchedMessages field={timeThresholdForm.get('userPercentage')} />
      <TouchedMessages field={timeThresholdForm.get('users')} />
    </>
  );
}

ConfigureUserImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateForm: PropTypes.func.isRequired
};
