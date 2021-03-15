/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ValidationBlock from 'in-components/form/ValidationBlock';

export default function BackendValidationMessages({ validationResult }) {
  if (validationResult.valid) {
    return null;
  }

  return <ValidationBlock hasError>{`${validationResult.error}.`}</ValidationBlock>;
}
