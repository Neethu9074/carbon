export function isTechnicalError(ec) {
  return ec === 'CLIENT' || ec === 'SERVER' || ec === 'TIMEOUT';
}
