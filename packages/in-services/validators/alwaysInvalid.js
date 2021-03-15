/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function alwaysInvalidValidator(message = 'Always invalid') {
  return () => [
    {
      severity: 'error',
      message
    }
  ];
}
