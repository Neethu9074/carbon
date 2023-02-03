/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Input from 'in-components/form/Input';

export default {
  component: Input
};

export const WithError = () => {
  return <Input hasError />;
};

export const WithErrorAndHiddenValidationInfoOnFocus = () => {
  return <Input hasError hideValidityInformationOnFocus />;
};

export const Default = () => <Input />;
