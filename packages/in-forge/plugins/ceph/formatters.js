/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export function healthFormatter(value) {
  if (value === 0) {
    return 'HEALTH_OK';
  } else if (value === 1) {
    return 'HEALTH_WARN';
  } else {
    return 'HEALTH_ERR';
  }
}
