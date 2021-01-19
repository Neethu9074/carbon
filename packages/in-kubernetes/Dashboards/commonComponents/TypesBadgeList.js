/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import theme from 'in-themes';
import React from 'react';

import BadgeList from 'in-new-components/BadgeList/BadgeList';

export default function TypesBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={() => theme.lib.colors.purple800} />;
}
