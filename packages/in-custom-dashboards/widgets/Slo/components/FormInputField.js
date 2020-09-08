import React from 'react';

import Input from 'in-components/form/Input';

export default function FormInputField({ form, onChange, fieldName, ...props }) {
  const field = form?.get(fieldName);
  return (
    <Input
      {...props}
      value={field?.value}
      hasError={field && !field?.valid && field?.touched}
      onChange={({ target }) => onChange([fieldName], f => f.setValue(target.value).setTouched(true))}
      maxLength={256}
    />
  );
}
