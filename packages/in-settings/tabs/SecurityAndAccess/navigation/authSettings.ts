/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  securityAndAccessGoogleSSO,
  securityAndAccessSaml,
  securityAndAccessOidc,
  securityAndAccessLdap,
  securityAndAccessGroupMapping,
  securityAndAccessTimeouts
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import GoogleSSO from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/GoogleSSO/GoogleSSO';
//@ts-expect-error not migrated to typescript yet
import SessionSettings from 'in-settings/tabs/SecurityAndAccess/pages/sessionSettings/SessionSettings';
//@ts-expect-error not migrated to typescript yet
import Saml from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/Saml/Saml';
//@ts-expect-error not migrated to typescript yet
import OIDC from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/OIDC/OIDC';
//@ts-expect-error not migrated to typescript yet
import Ldap from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/Ldap/Ldap';
import GroupMapping from 'in-settings/tabs/SecurityAndAccess/pages/indentityProviders/GroupMapping/GroupMapping';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export function getNavigationTreeForAuthentication(props: {
  isGoogleSSOAvailable: boolean;
  isSamlAvailable: boolean;
  isLdapAvailable: boolean;
  isOidcAvailable: boolean;
}) {
  const authAvailable =
    (role as any).canConfigureAuthenticationMethods &&
    (props.isGoogleSSOAvailable || props.isSamlAvailable || props.isLdapAvailable || props.isOidcAvailable);
  return [
    authAvailable && {
      title: t('in-settings:tabs.identityProviders'),
      pages: [
        props.isGoogleSSOAvailable && {
          path: securityAndAccessGoogleSSO,
          label: t('in-settings:tabs.googleSSO.idpTitle'),
          component: GoogleSSO
        },
        props.isSamlAvailable && {
          path: securityAndAccessSaml,
          label: t('in-settings:tabs.saml'),
          component: Saml
        },
        props.isOidcAvailable && {
          path: securityAndAccessOidc,
          label: t('in-settings:tabs.oidc'),
          component: OIDC
        },
        props.isLdapAvailable && {
          path: securityAndAccessLdap,
          label: t('in-settings:tabs.ldap'),
          component: Ldap
        },
        (role as any).canConfigureTeams && {
          path: securityAndAccessGroupMapping,
          label: t('in-settings:tabs.groupMapping'),
          component: GroupMapping
        }
      ].filter(Boolean)
    },
    (role as any).canConfigureSessionSettings && {
      title: t('in-settings:tabs.session'),
      pages: [
        {
          path: securityAndAccessTimeouts,
          label: t('in-settings:tabs.timeouts'),
          component: SessionSettings
        }
      ]
    }
  ].filter(Boolean);
}
