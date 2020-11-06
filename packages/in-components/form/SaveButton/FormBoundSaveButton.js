import React, { useContext } from 'react';
import { omit } from 'lodash';

import { FormContext } from 'in-components/form/binding/FormContext';
import SaveButton from 'in-components/form/SaveButton';

export default function FormBoundSaveButton(props) {
  const { form, disabled } = useContext(FormContext);
  return <SaveButton {...props} form={form} disabled={disabled} />;
}

FormBoundSaveButton.propTypes = omit(SaveButton.propTypes, ['form', 'disabled']);
