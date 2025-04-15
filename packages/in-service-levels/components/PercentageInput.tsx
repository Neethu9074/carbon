/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Input } from '@instana/components';

interface PercentageInputProps {
  id: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  hasError?: boolean;
  decimalPrecision?: number;
  className?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export default function PercentageInput({
  id,
  value,
  onChange,
  decimalPrecision = 4,
  hasError,
  className,
  min = 0,
  max = 100,
  disabled
}: PercentageInputProps) {
  const displayValue = formatNumber(value, decimalPrecision);

  return (
    <Input
      className={className}
      disabled={disabled}
      id={id}
      value={displayValue}
      type="number"
      onChange={e => {
        let newValue: number | undefined;
        const targetValue = e.target.valueAsNumber;

        if (!Number.isNaN(targetValue)) {
          const truncatedTargetValue = truncate(targetValue, decimalPrecision);
          newValue = round(truncatedTargetValue / 100, decimalPrecision + 2);
        }

        onChange(newValue);
      }}
      hasError={hasError}
      min={min}
      max={max}
      step={getStepSize(displayValue)}
    />
  );
}

function getStepSize(value: number | string): number {
  const [, digits] = value?.toString()?.split('.') ?? [];
  if (digits == null) {
    return 1;
  }

  return 1 / Math.pow(10, digits.length);
}

function formatNumber(value: number | undefined, decimalPrecision: number): number | string {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '';
  }

  return round(value * 100, decimalPrecision);
}

function round(value: number | string, decimals: number): number {
  return parseFloat(Number.parseFloat(`${value}`).toFixed(decimals));
}

function truncate(value: number, digitsDecimalPrecision: number): number {
  const stringValue = value.toString();
  const dotPosition = stringValue.indexOf('.');

  if (dotPosition === -1) return Number.parseFloat(stringValue);

  const truncatedNumber = stringValue.slice(0, dotPosition + (digitsDecimalPrecision + 1));
  return Number.parseFloat(truncatedNumber);
}
