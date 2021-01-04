import React from 'react';

import Input from 'in-components/form/Input';

export default function PercentageFormInput({ id, form, fieldName, onChange }) {
  const field = form.get(fieldName);
  const value = field?.value;
  return (
    <Input
      id={id}
      value={typeof value === 'number' ? parseFloat(Number.parseFloat(value * 100).toPrecision(6)) : value}
      type="number"
      onChange={e => {
        let newValue = undefined;
        if (e.target.value !== '' && !isNaN(e.target.valueAsNumber)) {
          newValue = parseFloat((e.target.valueAsNumber / 100).toPrecision(6));
        }
        onChange([fieldName], field => field.setValue(newValue).setTouched(true));
      }}
      hasError={!field?.valid && field?.touched}
      min={0}
      max={99.999}
      step="any"
    />
  );
}
