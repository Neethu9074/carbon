/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function isAnotherIdpActivated<T>(otherConfigs: Array<T> = []): number {
  return otherConfigs.filter(Boolean).length;
}
