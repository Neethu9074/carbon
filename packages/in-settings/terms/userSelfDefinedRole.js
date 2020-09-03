export function isDeprecatedUserDefinedRole(userSelfDefinedRole) {
  return (
    userSelfDefinedRole === 'undefined' ||
    userSelfDefinedRole === 'developer' ||
    userSelfDefinedRole === 'sysadmin' ||
    userSelfDefinedRole === 'nonTechnical'
  );
}
