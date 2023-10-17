/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import { useTheme } from 'in-themes';

export default function TypesBadgeList({ type, types }) {
  const theme = useTheme();
  return <BadgeList type={type} types={types} getColor={() => theme.ids.color.option.purple['500']} />;
}
