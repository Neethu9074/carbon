/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function isTechnicalError(ec) {
  return ec === 'CLIENT' || ec === 'SERVER' || ec === 'TIMEOUT';
}
