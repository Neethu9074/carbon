/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';

export function getBooleanTagFilters({ tagFilters, tag }) {
  const isTrue = find(tagFilters, f => f.name === tag && f.operator === 'EQUALS' && f.value === 'true');
  return { isTrue };
}
