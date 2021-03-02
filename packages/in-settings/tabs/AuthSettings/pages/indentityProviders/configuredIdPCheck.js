/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function isAnotherIdpActivated(otherConfigs = []) {
  return otherConfigs.filter(Boolean).length;
}
