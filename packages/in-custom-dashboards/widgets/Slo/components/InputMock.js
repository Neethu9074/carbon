import React from 'react';

import Input from 'in-components/form/Input';

export default function InputMock({ form, onChange, fieldName, ...props }) {
  return (
    <Input
      {...props}
      value={form?.get(fieldName)?.value}
      onChange={({ target }) => onChange([fieldName], f => f.setValue(target.value).setTouched(true))}
    />
  );
}
