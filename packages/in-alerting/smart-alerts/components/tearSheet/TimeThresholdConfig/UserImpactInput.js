/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Toggle } from '@instana/components';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { NUMBER_OF_USERS } from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureUserImpact';
import AlertTypography from 'in-alerting/components/AlertTypography';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';
import toogleLocals from 'in-alerting/smart-alerts/components/dialog/advanced/Toogle.mless';

export default function UserImpactInput({
  label,
  toggleName,
  toggleChecked,
  onToggle,
  inputMax,
  inputValue,
  inputName,
  inputPlaceholder,
  inputOnChange,
  inputDisabled,
  postLabel,
  inputType,
  timeThresholdForm
}) {
  return (
    <AlertThresholdConfigItemContainer noIcon isTearSheet isFourColumns>
      <AlertTypography variant={'body-regular'} color={'color900'} content={label} noMargin />
      <Toggle
        name={toggleName}
        className={toogleLocals.toggleDialogUsage}
        checked={toggleChecked}
        onToggle={onToggle}
      />

      <Input
        type="number"
        min={1}
        max={inputMax ?? undefined}
        name={inputName}
        value={inputValue}
        placeholder={inputPlaceholder}
        onChange={inputOnChange}
        step={1}
        disabled={inputDisabled}
      />
      <AlertTypography variant={'body-small'} color={'color600'} content={postLabel} noMargin />

      <div className={locals.configureImpactControlsWrapperTearsheet}>
        {inputType == NUMBER_OF_USERS
          ? timeThresholdForm.containsKey('users') && <TouchedMessages field={timeThresholdForm.get('users')} />
          : timeThresholdForm.containsKey('userPercentage') && (
              <TouchedMessages field={timeThresholdForm.get('userPercentage')} />
            )}
      </div>
    </AlertThresholdConfigItemContainer>
  );
}

UserImpactInput.propTypes = {
  label: PropTypes.string.isRequired,
  toggleName: PropTypes.string.isRequired,
  toggleChecked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  inputMax: PropTypes.number,
  inputValue: PropTypes.number,
  inputName: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
  inputOnChange: PropTypes.func.isRequired,
  inputDisabled: PropTypes.bool.isRequired,
  postLabel: PropTypes.string.isRequired,
  inputType: PropTypes.string.isRequired,
  timeThresholdForm: PropTypes.object.isRequired
};
