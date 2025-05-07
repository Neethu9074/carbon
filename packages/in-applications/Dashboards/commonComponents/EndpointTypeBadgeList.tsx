/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import BadgeList from 'in-components/BadgeList/BadgeList';
import { getColor } from 'in-applications/endpointTypes';

interface EndpointTypeBadgeListProps<T extends string> {
  /** @param type Single badge text */
  type: T;
  /** @param types Array of multiple badge texts */
  types: T[];
  /** @param limit Maximum number of badges to show*/
  limit?: number;
}
export default function EndpointTypeBadgeList<T extends string>({ type, types, limit }: EndpointTypeBadgeListProps<T>) {
  return <BadgeList type={type} types={types} getColor={getColor} limit={limit} />;
}
