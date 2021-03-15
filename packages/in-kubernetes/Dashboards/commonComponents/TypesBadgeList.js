/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-new-components/BadgeList/BadgeList';
import theme from 'in-themes';

export default function TypesBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={() => theme.lib.colors.purple800} />;
}
