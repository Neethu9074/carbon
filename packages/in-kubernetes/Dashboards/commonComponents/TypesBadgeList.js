/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';

export default function TypesBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={() => 'purple'} />;
}
