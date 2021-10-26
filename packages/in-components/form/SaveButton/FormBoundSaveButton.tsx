/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useContext } from 'react';

import { FormContext } from 'in-components/form/binding/FormContext';
import SaveButton, { Props } from 'in-components/form/SaveButton';

export default function FormBoundSaveButton(props: Props) {
  const ctx = useContext(FormContext);
  return <SaveButton {...props} form={ctx?.form} disabled={ctx?.disabled} />;
}
