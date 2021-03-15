/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export function isDeprecatedUserDefinedRole(userSelfDefinedRole) {
  return (
    userSelfDefinedRole === 'undefined' ||
    userSelfDefinedRole === 'developer' ||
    userSelfDefinedRole === 'sysadmin' ||
    userSelfDefinedRole === 'nonTechnical'
  );
}
