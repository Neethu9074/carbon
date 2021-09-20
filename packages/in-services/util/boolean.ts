/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function compare(a: boolean, b: boolean) {
  return a === b ? 0 : a ? -1 : 1;
}
