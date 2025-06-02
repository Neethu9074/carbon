/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Select } from '@instana/carbon';

import { enabledBeaconTypes } from 'in-service-levels/constants';
import { SloBeaconTypes } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './BeaconSelector.mless';

interface BeaconSelectorProps {
  disabled?: boolean;
  hasError?: boolean;
  onChange: (beaconType: SloBeaconTypes) => void;
  value: SloBeaconTypes;
}

export default function BeaconSelector({ disabled, hasError, onChange, value }: BeaconSelectorProps) {
  return (
    <div className={locals.beaconSelectField}>
      <Select
        id="slo-select-beacon"
        disabled={disabled}
        value={value}
        onChange={({ target: { value } }) => onChange(value as SloBeaconTypes)}
        invalid={hasError}
        size="sm"
        noLabel
      >
        {enabledBeaconTypes.map(beaconType => (
          <option key={beaconType} value={beaconType}>
            {t('in-service-levels:createSloDialog.beaconTypes.beaconLabel', { context: beaconType })}
          </option>
        ))}
      </Select>
    </div>
  );
}
