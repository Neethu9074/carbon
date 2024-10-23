/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { default as LegacyComboBox } from 'in-components/ComboBox/LegacyComboBox';
import { default as CarbonComboBox } from 'in-components/ComboBox/CarbonComboBox';
import { hasMultipleValuesSelected } from 'in-components/ComboBox/LegacyComboBox';
import { carbonComboBoxEnabled } from 'in-services/featureFlags';
import { ComboBoxProps } from './types';

export type { Option, Options, ComboBoxProps } from 'in-components/ComboBox/types';
export { hasMultipleValuesSelected };

export default function ComboBox({ isClearable = true, ...props }: ComboBoxProps): JSX.Element {
  if (!props?.isMulti && carbonComboBoxEnabled) {
    return <CarbonComboBox {...props} isClearable={isClearable} />;
  }
  return <LegacyComboBox {...props} isClearable={isClearable} />;
}
