/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { ErrorCode } from 'in-types';

export function isTechnicalError(ec: ErrorCode) {
  return ec === 'CLIENT' || ec === 'SERVER' || ec === 'TIMEOUT' || ec === 'GATEWAY_TIMEOUT';
}
