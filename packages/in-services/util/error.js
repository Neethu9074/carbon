// @flow

export function isTechnicalError(ec: ?ErrorCode) {
  return ec === 'CLIENT' || ec === 'SERVER' || ec === 'TIMEOUT';
}
