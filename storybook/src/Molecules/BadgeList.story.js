import { withKnobs } from '@storybook/addon-knobs';
import theme from 'in-themes';
import React from 'react';

import BadgeList from 'in-new-components/BadgeList/BadgeList';

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
