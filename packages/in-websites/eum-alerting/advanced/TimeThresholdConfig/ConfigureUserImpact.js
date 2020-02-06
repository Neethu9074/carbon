import PropTypes from 'prop-types';
import React from 'react';

import AlertThresholdConfigItemContainer from 'in-websites/eum-alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { hiddenFieldNames, fieldNames } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup/FormGroup';
import Toggle from 'in-components/form/Toggle';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

import locals from './TimeThresholdConfig.mless';

export default function ConfigureUserImpact({ form, onChange }) {
  return (
    <>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted">
        <div className={locals.operatorLabel}>At least</div>
        <div>
          <FormGroup className={locals.formGroup} withoutBottomMargin>
            <Label># of Users</Label>
            {form.get(fieldNames.timeThresholdUsers).map(({ value }) => (
              <Input
                className={locals.input}
                type="number"
                min="1"
                name={fieldNames.timeThresholdUsers}
                value={value}
                onChange={e =>
                  onChange(form, fieldNames.timeThresholdUsers, e.target.value !== '' ? Math.abs(e.target.value) : '')
                }
                step="1"
                disabled={!form.get(hiddenFieldNames.alertByNumberOfImpactedUsersEnabled).value}
              />
            ))}
          </FormGroup>
        </div>
        {form.get(hiddenFieldNames.alertByNumberOfImpactedUsersEnabled).map(({ value }) => (
          <Toggle
            name={hiddenFieldNames.alertByNumberOfImpactedUsersEnabled}
            className={locals.toggle}
            checked={value}
            onChange={() => {
              const _value = !value;
              const alertByPercentageEnabled = form.get(hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled).value;
              const alertByPercentageOfImpactedUsersEnabled = {
                name: hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled,
                value: (!_value && !alertByPercentageEnabled) || alertByPercentageEnabled
              };
              onChange(
                form,
                hiddenFieldNames.alertByNumberOfImpactedUsersEnabled,
                _value,
                alertByPercentageOfImpactedUsersEnabled
              );
            }}
          />
        ))}
      </AlertThresholdConfigItemContainer>
      <AlertThresholdConfigItemContainer iconType="lib_alerts_user_impacted">
        <div className={locals.operatorLabel}>At least</div>
        <div>
          <FormGroup className={locals.formGroup} withoutBottomMargin>
            <Label>% of Users</Label>
            {form.get(fieldNames.timeThresholdUserPercentage).map(({ value }) => (
              <Input
                className={locals.input}
                type="number"
                min="1"
                max="100"
                name={fieldNames.timeThresholdUserPercentage}
                value={value * 100}
                onChange={e =>
                  onChange(
                    form,
                    fieldNames.timeThresholdUserPercentage,
                    e.target.value !== '' ? Math.abs(e.target.value) / 100 : ''
                  )
                }
                step="1"
                disabled={!form.get(hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled).value}
              />
            ))}
          </FormGroup>
        </div>
        {form.get(hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled).map(({ value }) => (
          <Toggle
            name={hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled}
            className={locals.toggle}
            checked={value}
            onChange={() => {
              const _value = !value;
              const alertByNumberEnabled = form.get(hiddenFieldNames.alertByNumberOfImpactedUsersEnabled).value;
              const alertByNumberOfImpactedUsersEnabled = {
                name: hiddenFieldNames.alertByNumberOfImpactedUsersEnabled,
                value: (!_value && !alertByNumberEnabled) || alertByNumberEnabled
              };
              onChange(
                form,
                hiddenFieldNames.alertByPercentageOfImpactedUsersEnabled,
                _value,
                alertByNumberOfImpactedUsersEnabled
              );
            }}
          />
        ))}
      </AlertThresholdConfigItemContainer>
      <TouchedMessages field={form.get(fieldNames.timeThresholdUserPercentage)} />
      <TouchedMessages field={form.get(fieldNames.timeThresholdUsers)} />
    </>
  );
}

ConfigureUserImpact.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
