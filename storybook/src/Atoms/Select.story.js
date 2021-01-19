/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Select from 'in-components/form/Select';

export default {
  title: 'Atoms|FormControl/Select',
  component: Select
};

export const Default = () => (
  <Select>
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
    <option value="D">Option D</option>
  </Select>
);

export const Disabled = () => (
  <Select disabled>
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
    <option value="D">Option D</option>
  </Select>
);
