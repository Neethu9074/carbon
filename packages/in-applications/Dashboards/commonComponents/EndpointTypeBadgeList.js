/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import { getColor } from 'in-applications/endpointTypes';

export default function EndpointTypeBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={getColor} />;
}
