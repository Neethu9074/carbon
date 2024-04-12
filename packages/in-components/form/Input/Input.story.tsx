/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Input from 'in-components/form/Input';

export default {
  component: Input
};

export const TextWithError = () => {
  return <Input hasError />;
};

export const NumberNoDefaultValue = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '25%' }}>
      <Input type="number" />
      <Input type="number" carbonVariant />
    </div>
  );
};

export const NumberDefaultValueAsEmptyString = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '25%' }}>
      <Input type="number" placeholder="#" value="" />
      <Input type="number" placeholder="#" value="" carbonVariant />
    </div>
  );
};

export const NumberWithError = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '25%' }}>
      <Input type="number" hasError />
      <Input type="number" hasError carbonVariant />
    </div>
  );
};

export const WithErrorAndHiddenValidationInfoOnFocus = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem', width: '25%' }}>
      <Input hasError type="number" hideValidityInformationOnFocus />
      <Input hasError type="number" hideValidityInformationOnFocus carbonVariant />
    </div>
  );
};
