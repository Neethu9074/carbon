/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

//@ts-expect-error not migrated to typescript yet
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
//@ts-expect-error not migrated to typescript yet
import SessionSettings from 'in-settings/tabs/AuthSettings/pages/sessionSettings/SessionSettings';
//@ts-expect-error not migrated to typescript yet
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
//@ts-expect-error not migrated to typescript yet
import OIDC from 'in-settings/tabs/AuthSettings/pages/indentityProviders/OIDC/OIDC';
//@ts-expect-error not migrated to typescript yet
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import GroupMapping from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GroupMapping/GroupMapping';
import { googleSSO, saml, oidc, ldap, groupMapping, timeouts } from 'in-settings/navigation/paths';
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
          path: googleSSO,
          label: t('in-settings:tabs.googleSSO.idpTitle'),
          component: GoogleSSO
        },
        props.isSamlAvailable && {
          path: saml,
          label: t('in-settings:tabs.saml'),
          component: Saml
        },
        props.isOidcAvailable && {
          path: oidc,
          label: t('in-settings:tabs.oidc'),
          component: OIDC
        },
        props.isLdapAvailable && {
          path: ldap,
          label: t('in-settings:tabs.ldap'),
          component: Ldap
        },
        (role as any).canConfigureTeams && {
          path: groupMapping,
          label: t('in-settings:tabs.groupMapping'),
          component: GroupMapping
        }
      ].filter(Boolean)
    },
    (role as any).canConfigureSessionSettings && {
      title: t('in-settings:tabs.session'),
      pages: [
        {
          path: timeouts,
          label: t('in-settings:tabs.timeouts'),
          component: SessionSettings
        }
      ]
    }
  ].filter(Boolean);
}
