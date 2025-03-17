/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import { useState } from 'react';
import React from 'react';

import { Stack } from '@instana/components';

import Dropdown from 'in-alerting/components/Dropdown';

export default {
  component: Dropdown
};

export const Default = {
  render: () => (
    <Stack direction="vertical" align="start">
      <Dropdown
        value="plain"
        items={[
          {
            value: 'plain',
            label: 'Plain Dropdown'
          },
          {
            value: 'with_icon',
            label: 'Dropdown With Icon'
          }
        ]}
        onChange={storybookAction('onChange')}
      />
    </Stack>
  ),

  name: 'default'
};

export const OnChange = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [currentValue, setCurrentValue] = useState(3);

    return (
      <Stack direction="vertical" align="start">
        <Dropdown
          value={currentValue}
          onChange={value => {
            storybookAction('onChange')(value);
            setCurrentValue(value);
          }}
          items={[
            {
              value: 1,
              label: 'Foobar (value: 1)'
            },
            {
              value: 2,
              label: 'Baz (value: 2)'
            },
            {
              value: 3,
              label: 'Value: 3 - Duplicate A'
            },
            {
              value: 3,
              label: 'Value: 3 - Duplicate B'
            }
          ]}
        />
        <dt>Selected item`&apos;`s value:</dt>
        <dd>{currentValue}</dd>
      </Stack>
    );
  },

  name: 'onChange'
};
