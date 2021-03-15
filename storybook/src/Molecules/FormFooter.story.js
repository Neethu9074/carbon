/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import FormFooter, { SaveButton, CancelButton, DeleteButton } from 'in-components/form/FormFooter/FormFooter';

export default {
  title: 'Molecules|FormFooter',
  component: FormFooter
};

export const Default = () => {
  return (
    <FormFooter>
      <SaveButton />
      <CancelButton />
      <DeleteButton />
    </FormFooter>
  );
};

export const Customized = () => {
  return (
    <FormFooter>
      <SaveButton icon="lib_application">Foo</SaveButton>
      <CancelButton />
      <DeleteButton />
    </FormFooter>
  );
};
