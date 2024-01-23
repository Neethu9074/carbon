/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import BadgeList from 'in-components/BadgeList/BadgeList';

export default function TypesBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={() => themes.default.ids.color.option.purple['500']} />;
}
