/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

export type Nullish = null | undefined;

export type Mutable<T> = {
  -readonly [Property in keyof T]: T[Property];
};

export type SortComparator<T> = (lhs: T, rhs: T) => number;

export type PickPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type PartialExcept<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
