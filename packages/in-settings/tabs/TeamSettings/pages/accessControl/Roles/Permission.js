import React from 'react';

import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';

export default function Permission({ form, onChange, name, label, helpText, disabled, withoutBottomBorder }) {
  const field = form.get(name);

  return (
    <HorizontalFormGroup helpText={helpText} withoutBottomBorder={withoutBottomBorder}>
      <Label htmlFor={`role-${name}`}>{label}</Label>
      <Toggle
        id={`role-${name}`}
        checked={field.value}
        onChange={e => onChange(name, e.target.checked)}
        disabled={disabled}
      />
    </HorizontalFormGroup>
  );
}
