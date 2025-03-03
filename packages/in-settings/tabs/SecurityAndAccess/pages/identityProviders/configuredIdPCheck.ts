/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function isAnotherIdpActivated<T>(otherConfigs: Array<T> = []): boolean {
  return otherConfigs.filter(Boolean).length > 0;
}
