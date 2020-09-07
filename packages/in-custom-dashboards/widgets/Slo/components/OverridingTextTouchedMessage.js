import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

export function OverridingTextTouchedMessage({ field, message }) {
  return field && field.touched && !field.valid && <ValidationBlock>{message}</ValidationBlock>;
}
