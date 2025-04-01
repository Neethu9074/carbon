/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { AuthenticationOverview, IdpState } from '@instana/types';

export function isAnyIdpAvailable({ ldap, oidc, saml, sso }: Partial<AuthenticationOverview>): boolean {
  return isIdpAvailable(ldap) || isIdpAvailable(oidc) || isIdpAvailable(saml) || isIdpAvailable(sso);
}

export function isAnyIdPActive({ ldap, oidc, saml, sso }: Partial<AuthenticationOverview>): boolean {
  return isIdpActive(ldap) || isIdpActive(oidc) || isIdpActive(saml) || isIdpActive(sso);
}

export function isIdpActive(idp: IdpState | undefined): boolean {
  return Boolean(idp && idp === 'ACTIVE');
}

export function isIdpAvailable(idp: IdpState | undefined): boolean {
  return Boolean(idp && idp !== 'DISABLED');
}
