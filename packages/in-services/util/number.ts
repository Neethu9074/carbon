/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

type Result = 1 | 0 | -1;

export function compare(a?: number, b?: number): Result {
  if (a == null && b == null) {
    return 0;
  } else if (a == null) {
    return -1;
  } else if (b == null) {
    return 1;
  } else if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }

  return 0;
}

export function isParseableAsNumber(n: number): boolean {
  return !isNaN(n) && isFinite(n);
}
