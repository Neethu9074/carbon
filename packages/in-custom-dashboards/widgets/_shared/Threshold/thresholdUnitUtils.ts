/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { decimalSeparator, thousandsSeparator } from 'in-services/formatters/number';

export function shouldDisplayConvertedUnits(value: string) {
  const baseUnits = ['B', 'ms'];

  // Extract numeric and unit using regular expression
  const regex = new RegExp(`^(-?[0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);
  const matches = value.trim().match(regex);

  if (!matches) {
    return true;
  }

  const numericPart = Number(matches[1].replace(/,/g, ''));
  const unitPart = matches[2].trim();

  // In case there is no unit, check if numeric part is valid
  if (!unitPart) {
    return Number.isNaN(numericPart);
  }
  return !baseUnits.includes(unitPart);
}

export function getUnit(formattedValue: string | null | undefined): string {
  if (!formattedValue) {
    return '';
  }
  const valueSplitRegExp = new RegExp(`^(-?[0-9\\${decimalSeparator}\\${thousandsSeparator}]+)(.*)$`);
  const match = String(formattedValue).match(valueSplitRegExp);
  if (match) {
    return match[2].trim();
  }
  return '';
}
