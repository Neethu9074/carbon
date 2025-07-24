/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find, sortBy } from 'lodash';

import { TagFilter } from '@instana/types';

interface NumberTagFiltersArgs {
  tagFilters: TagFilter[];
  tag: string;
  showRange?: boolean;
  showEquality?: boolean;
}

interface NumberTagFilters {
  eq: TagFilter | undefined;
  neq: TagFilter | undefined;
  lt: TagFilter | undefined;
  lte: TagFilter | undefined;
  gt: TagFilter | undefined;
  gte: TagFilter | undefined;
}

export function getNumberTagFilters({
  tagFilters,
  tag,
  showRange,
  showEquality
}: NumberTagFiltersArgs): NumberTagFilters {
  let eq: TagFilter | undefined,
    neq: TagFilter | undefined,
    lt: TagFilter | undefined,
    lte: TagFilter | undefined,
    gt: TagFilter | undefined,
    gte: TagFilter | undefined;

  if (showEquality) {
    eq = find<TagFilter>(tagFilters, byTagAndOperator(tag, 'EQUALS'));
    neq = find<TagFilter>(tagFilters, byTagAndOperator(tag, 'NOT_EQUAL'));
  }

  if (showRange) {
    const tagFiltersAscending = sortBy<TagFilter>(tagFilters, valueAsc);
    lt = find<TagFilter>(tagFiltersAscending, byTagAndOperator(tag, 'LESS_THAN'));
    lte = find<TagFilter>(tagFiltersAscending, byTagAndOperator(tag, 'LESS_OR_EQUAL_THAN'));

    const tagFiltersDescending = sortBy<TagFilter>(tagFilters, valueDesc);
    gt = find<TagFilter>(tagFiltersDescending, byTagAndOperator(tag, 'GREATER_THAN'));
    gte = find<TagFilter>(tagFiltersDescending, byTagAndOperator(tag, 'GREATER_OR_EQUAL_THAN'));
  }

  return { eq, neq, lt, lte, gt, gte };
}

export function showLt(value: string | number, other: string | number): boolean {
  return !!value && (!other || value <= other);
}

export function showGt(value: string | number, other: string | number): boolean {
  return !!value && (!other || value >= other);
}

function byTagAndOperator(tag: string, operator: string): (tf: TagFilter) => boolean {
  return f => f.name === tag && f.operator === operator;
}

const valueAsc = (t: TagFilter): number => parseInt(t.value);
const valueDesc = (t: TagFilter): number => -1 * parseInt(t.value);
