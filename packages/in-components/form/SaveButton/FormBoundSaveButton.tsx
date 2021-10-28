/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useContext } from 'react';

import SaveButton, { SaveButtonProps } from 'in-components/form/SaveButton';
import { FormContext } from 'in-components/form/binding/FormContext';

export default function FormBoundSaveButton(props: SaveButtonProps) {
  const ctx = useContext(FormContext);
  return <SaveButton {...props} form={ctx?.form} disabled={ctx?.disabled} />;
}
