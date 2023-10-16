/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import { useTheme } from 'in-themes';

export default {
  component: BadgeList
};

export const Default = () => {
  const theme = useTheme();
  return <BadgeList type="Badge" getColor={() => theme.ids.color.option.purple['500']} />;
};

export const List = () => {
  const theme = useTheme();
  const types = ['Badge 1', 'Badge 2', 'Badge 2'];
  return <BadgeList types={types} getColor={() => theme.ids.color.option.purple['500']} />;
};
export const LimitedList = () => {
  const theme = useTheme();
  const types = ['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4', 'Badge 5', 'Badge 6'];
  return <BadgeList types={types} getColor={() => theme.ids.color.option.purple['500']} limit={3} />;
};
