/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import type { DateInputProps as LegacyInputProps } from './LegacyDateInput';
import { carbonDateInputEnabled } from 'in-services/featureFlags';
import LegacyDateInput from './LegacyDateInput';
import CarbonDateInput from './CarbonDateInput';

export default function DateInput({ ...props }: LegacyInputProps): JSX.Element {
  if (carbonDateInputEnabled) {
    return <CarbonDateInput {...props} />;
  }
  return <LegacyDateInput {...props} />;
}
