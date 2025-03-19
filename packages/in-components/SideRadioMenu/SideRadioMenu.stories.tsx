/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error ignoring that this dependency is installed in storybook folder only, so would not be resolved here
import type { Meta, StoryObj } from '@storybook/react';

import SideRadioMenu from 'in-components/SideRadioMenu/SideRadioMenu';

const meta: Meta<typeof SideRadioMenu> = {
  component: SideRadioMenu,
  args: {
    items: [
      {
        name: 'item 1 (with value/id=1)',
        id: '1'
      },
      {
        name: 'item 2 (with value/id=2)',
        id: '2'
      }
    ]
  },
  argTypes: {
    advancedMode: {
      control: 'boolean'
    },
    legendHidden: {
      control: 'boolean'
    },
    legendText: {
      control: 'text'
    },
    onChange: {
      control: 'action'
    },
    valueSelected: { control: 'text' }
  }
};

export default meta;

type Story = StoryObj<typeof SideRadioMenu>;

export const Playground: Story = {};

export const AllProps: Story = {
  args: {
    advancedMode: true,
    legendHidden: false,
    legendText: 'Some legend description',
    valueSelected: '2'
  }
};
