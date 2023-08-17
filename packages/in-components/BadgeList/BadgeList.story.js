/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import theme from 'in-themes';

export default {
  component: BadgeList
};

export const Default = () => {
  return <BadgeList type="Badge" getColor={() => theme.lib.colors.purple800} />;
};

export const List = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 2'];
  return <BadgeList types={types} getColor={() => theme.lib.colors.purple800} />;
};
export const LimitedList = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4', 'Badge 5', 'Badge 6'];
  return <BadgeList types={types} getColor={() => theme.lib.colors.purple800} limit={3} />;
};
