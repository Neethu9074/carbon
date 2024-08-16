/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import type {DateInputProps as LegacyInputProps} from './LegacyDateInput';
import { carbonDateInputEnabled } from 'in-services/featureFlags';
import { default as LegacyDateInput } from './LegacyDateInput';
import { default as CarbonDateInput } from './CarbonDateInput';

export default function DateInput({ ...props }: LegacyInputProps): JSX.Element {
  if (carbonDateInputEnabled) {
    return <CarbonDateInput {...props} />;
  }
  return <LegacyDateInput {...props} />;
}
