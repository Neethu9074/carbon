/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createMapForm, createField, notBlankValidator } from 'formalistic';
import { action as storybookAction } from '@storybook/addon-actions';
import React, { useState } from 'react';

import SaveButton from 'in-components/form/SaveButton/FormBoundSaveButton';
import Input from 'in-components/form/Input/FormBoundInput';
import SubForm from 'in-components/form/binding/SubForm';
import Form from 'in-components/form/binding/Form';

export default {
  title: 'Form binding'
};

export function ExampleForm() {
  const initialForm = createMapForm()
    .put('name', createField({ value: 'name', validator: notBlankValidator }))
    .put('name1', createField({ value: 'name1' }))
    .put('surName', createField({ value: 'surName' }))
    .put('age', createField({ value: 42 }))

    .put(
      'address',
      createMapForm()
        .put('street', createField({ value: 'street' }))
        .put('city', createField({ value: 'Solingen' }))
    );

  const [form, setForm] = useState(initialForm); // as usual

  return (
    <Form form={form} setForm={setForm} onSubmit={storybookAction('onSubmit')}>
      <Input path="name" label="Name" />
      <Input path="surName" label="Surname" />
      <Input path="age" type="number" label="Age" />
      <Input path="not-exist" autoHide label="nothing" />
      <Input path={['address', 'street']} label="Street" />

      <h2>Address</h2>
      <SubForm path="address">
        <Input path="street" label="Street" />
        <Input path="city" label="City" />
      </SubForm>

      <SaveButton />
    </Form>
  );
}
