/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find, sortBy } from 'lodash';

const valueAsc = t => parseInt(t.value);
const valueDesc = t => -1 * parseInt(t.value);

export function getNumberTagFilters({ tagFilters, tag, showRange, showEquality }) {
  const eq = showEquality && find(tagFilters, f => f.name === tag && f.operator === 'EQUALS');
  const neq = showEquality && find(tagFilters, f => f.name === tag && f.operator === 'NOT_EQUAL');
  const lt = showRange && find(sortBy(tagFilters, valueAsc), f => f.name === tag && f.operator === 'LESS_THAN');
  const lte =
    showRange && find(sortBy(tagFilters, valueAsc), f => f.name === tag && f.operator === 'LESS_OR_EQUAL_THAN');
  const gt = showRange && find(sortBy(tagFilters, valueDesc), f => f.name === tag && f.operator === 'GREATER_THAN');
  const gte =
    showRange && find(sortBy(tagFilters, valueDesc), f => f.name === tag && f.operator === 'GREATER_OR_EQUAL_THAN');
  return { eq, neq, lt, lte, gt, gte };
}

export function showLt(value, other) {
  return value && (!other || value <= other);
}

export function showGt(value, other) {
  return value && (!other || value >= other);
}
