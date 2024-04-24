/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Select } from '@instana/components';

import { enabledBeaconTypes } from 'in-service-levels/constants';
import { SloBeaconTypes } from 'in-service-levels/types';
import { t } from 'in-i18n';

interface BeaconSelectorProps {
  disabled?: boolean;
  hasError?: boolean;
  onChange: (beaconType: SloBeaconTypes) => void;
  value: SloBeaconTypes;
}

export default function BeaconSelector({ disabled, hasError, onChange, value }: BeaconSelectorProps) {
  return (
    <Select
      disabled={disabled}
      value={value}
      onChange={({ target: { value } }) => onChange(value as SloBeaconTypes)}
      hasError={hasError}
    >
      {enabledBeaconTypes.map(beaconType => (
        <option key={beaconType} value={beaconType}>
          {t('in-service-levels:createSloDialog.beaconTypes.beaconLabel', { context: beaconType })}
        </option>
      ))}
    </Select>
  );
}
