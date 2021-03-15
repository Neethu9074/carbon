/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { availabilityType } from 'in-custom-dashboards/widgets/Slo/sli/sliTypes';
import { number } from 'in-services/formatters/number';

export function getSliFormatter(sliEntity) {
  const isAvailabilitySli = sliEntity?.sliType === availabilityType;
  return isAvailabilitySli ? callsFormatter : minutesFormatter;
}

function callsFormatter(value) {
  const unit = value === 1 ? 'call' : 'calls';
  if (value >= 10000) {
    return `${number.detailed(value / 1000)}K ${unit}`;
  }
  return `${number.compact(value)} ${unit}`;
}

function minutesFormatter(value) {
  // not using the existing minutes formatter, because it starts rounding values to hours when >= 60, and also does not
  // include a whitespace between the value and the unit
  return `${number.compact(value)} m`;
}
