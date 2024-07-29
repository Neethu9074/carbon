/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { carbonComboBoxEnabled } from 'in-services/featureFlags';
import { default as LegacyComboBox } from './LegacyComboBox';
import { default as CarbonComboBox } from './CarbonComboBox';
import { ComboBoxProps } from './types';

export type {Option, Options, ComboBoxProps} from './types';
import { hasMultipleValuesSelected } from './LegacyComboBox';
export { hasMultipleValuesSelected };


export default function ComboBox({ isClearable = true, ...props }: ComboBoxProps): JSX.Element {
  if (!props?.isMulti && carbonComboBoxEnabled) {
    return <CarbonComboBox {...props} isClearable={isClearable} />;
  }
  return <LegacyComboBox {...props} isClearable={isClearable} />;
}

