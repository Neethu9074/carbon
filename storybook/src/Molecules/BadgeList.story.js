/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import theme from 'in-themes';

export default {
  title: 'Molecules|BadgeList',
  component: BadgeList,
  decorators: [withKnobs]
};

export const Default = () => {
  return <BadgeList type="Badge" getColor={() => theme.lib.colors.purple800} />;
};

export const List = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 2'];
  return <BadgeList types={types} getColor={() => theme.lib.colors.purple800} />;
};
