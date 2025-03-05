/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import SelectorOverlay from 'in-components/SelectorOverlay/SelectorOverlay';

const options = [
  {
    label: 'Root Level Leaf',
    description: 'Some description - Root Level Leaf',
    icon: 'plugin:host'
  },
  {
    label: 'Root Level Node',
    description: 'Some description - Root Level Node',
    icon: 'plugin:neo4j',
    children: [
      {
        label: 'First Level Leaf',
        description: 'Some description - First Level Leaf',
        icon: 'plugin:docker'
      },
      {
        label: 'First Level Node',
        description: 'Some description - First Level Node',
        icon: 'plugin:mule',
        children: [
          {
            label: 'Second Level Leaf'
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description - Third Level Leaf'
              }
            ]
          }
        ]
      }
    ]
  }
];

const optionsFilteredOnALevel = [
  {
    label: 'Root Level Node',
    description: 'Some description - Root Level Node',
    icon: 'plugin:neo4j',
    children: [
      {
        label: 'First Level Node',
        description: 'Some description - First Level Node',
        icon: 'plugin:mule',
        children: [
          {
            label: 'Second Level Leaf'
          },
          {
            label: 'Second Level Node',
            description: 'Some description',
            icon: 'plugin:mule',
            children: [
              {
                label: 'Third Level Leaf',
                description: 'Some description - Third Level Leaf'
              }
            ]
          }
        ]
      }
    ]
  }
];

export default {
  title: 'in-components/SelectorOverlay/SelectorOverlay'
};

export const Default = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={options} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'default'
};

export const FilteredOnALevel = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={optionsFilteredOnALevel} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'filtered on a level'
};

export const FilteredOnALevelWithNoBackButton = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={optionsFilteredOnALevel} backButton={false} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'filtered on a level with no back button'
};

export const Loading = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={[]} loading />
    </PermanentlyVisibleOverlay>
  ),

  name: 'loading'
};

export const NoIcons = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={options} withIcons={false} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'no-icons'
};

export const WithSearch = {
  render: () => (
    <PermanentlyVisibleOverlay>
      <SelectorOverlay onChange={storybookAction('onChange')} options={options} withIcons={false} query={'a'} />
    </PermanentlyVisibleOverlay>
  ),

  name: 'with search'
};
