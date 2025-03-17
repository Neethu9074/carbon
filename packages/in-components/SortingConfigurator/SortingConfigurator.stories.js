/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';

const options = [
  {
    value: 'suggestion_one',
    label: 'Name'
  },
  {
    value: 'suggestion_two',
    label: (
      <>
        Latency (<strong>P95</strong>)
      </>
    )
  },
  {
    value: 'suggestion_three',
    label: (
      <>
        Error Rate (<strong>mean</strong>)
      </>
    )
  }
];

export default {
  component: SortingConfigurator
};

export const Default = {
  render: () => (
    <SortingConfigurator
      options={options}
      orderBy={{
        by: options[1].value,
        direction: 'ASC'
      }}
      onChange={storybookAction('onChange')}
    />
  ),

  name: 'default'
};
