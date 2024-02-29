/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import BadgeList from 'in-components/BadgeList/BadgeList';

export default {
  component: BadgeList
};

export const Default = () => {
  return <BadgeList type="Badge" getColor={() => themes.default.ids.color.option.purple['500']} />;
};

export const List = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 2'];
  return <BadgeList types={types} getColor={() => themes.default.ids.color.option.purple['500']} />;
};
export const LimitedList = () => {
  const types = ['Badge 1', 'Badge 2', 'Badge 3', 'Badge 4', 'Badge 5', 'Badge 6'];
  return <BadgeList types={types} getColor={() => themes.default.ids.color.option.purple['500']} limit={3} />;
};
