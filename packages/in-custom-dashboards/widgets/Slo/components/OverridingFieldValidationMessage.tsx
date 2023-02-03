/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import { Item } from 'formalistic';

import ValidationBlock from 'in-components/form/ValidationBlock';

interface OverridingFieldValidationMessageProps {
  field?: Item;
  message: ReactNode;
}

export function OverridingFieldValidationMessage({ field, message }: OverridingFieldValidationMessageProps) {
  const isFieldValid = field?.valid;
  const isFieldTouched = field?.touched;

  if (!(isFieldTouched && !isFieldValid)) {
    return null;
  }
  return <ValidationBlock>{message}</ValidationBlock>;
}
