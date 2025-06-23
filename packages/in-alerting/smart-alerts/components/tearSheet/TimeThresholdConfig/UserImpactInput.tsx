/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Toggle } from '@instana/components';

import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import { NUMBER_OF_USERS } from 'in-alerting/smart-alerts/components/tearSheet/TimeThresholdConfig/ConfigureUserImpact';
import AlertTypography from 'in-alerting/components/AlertTypography';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Input from 'in-components/form/Input';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/TimeThresholdConfig/TimeThresholdConfig.mless';
import toogleLocals from 'in-alerting/smart-alerts/components/dialog/advanced/Toogle.mless';

export interface UserImpactInputProps {
  label: string;
  toggleName: string;
  toggleChecked: boolean;
  onToggle: () => void;
  inputValue: number | undefined;
  inputName: string;
  inputPlaceholder: string;
  inputOnChange: (e: any) => void;
  inputDisabled: boolean;
  postLabel: string;
  inputType: string;
  timeThresholdForm: MapForm<any>;
  inputMax?: number;
}

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
}: UserImpactInputProps) {
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
