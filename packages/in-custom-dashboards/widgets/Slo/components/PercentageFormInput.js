import React from 'react';

import Input from 'in-components/form/Input';

export function PercentageFormInput({ form, fieldName, onChange }) {
  const field = form.get(fieldName);
  const value = field?.value;
  return (
    <Input
      value={typeof value === 'number' ? parseFloat(Number.parseFloat(value * 100).toPrecision(6)) : value}
      type="number"
      onChange={({ target }) => {
        const value = target.value;
        onChange([fieldName], f =>
          f
            .setValue(value ? parseFloat(Number.parseFloat(target.valueAsNumber / 100).toPrecision(6)) : '')
            .setTouched(true)
        );
      }}
      hasError={!field?.valid && field?.touched}
      min={0}
      max={99.999}
      step="any"
    />
  );
}
