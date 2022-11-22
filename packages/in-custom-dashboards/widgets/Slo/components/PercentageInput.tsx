/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Input from 'in-components/form/Input';

interface PercentageInputProps {
  id: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  hasError?: boolean;
  decimalPrecision?: number;
}

export default function PercentageInput({ id, value, onChange, decimalPrecision = 4, hasError }: PercentageInputProps) {
  const displayValue = formatNumber(value, decimalPrecision);

  return (
    <Input
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
      min="0"
      max="100"
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
  const trucatedNumber = value.toString().slice(0, value.toString().indexOf('.') + (digitsDecimalPrecision + 1));
  return Number.parseFloat(trucatedNumber);
}
