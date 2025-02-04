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
  securityAndAccessTimeouts,
  securityAndAccessIdentityProviders
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import SessionSettings from 'in-settings/tabs/SecurityAndAccess/pages/sessionSettings/SessionSettings';
import GroupMapping from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GroupMapping/GroupMapping';
import IdentityProviders from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/identityProviders';
import GoogleSSO from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSO';
import Saml from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Saml/Saml';
import OIDC from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDC';
import Ldap from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export function getNavigationTreeForAuthentication(props: ViewProps) {
  const authAvailable =
    (role as any).canConfigureAuthenticationMethods &&
    (props.isGoogleSSOAvailable || props.isSamlAvailable || props.isLdapAvailable || props.isOidcAvailable);

  if (idpConfigV2Enabled) {
    return [
      {
        title: t('in-settings:tabs.authentication'),
        pages: [
          authAvailable && {
            path: securityAndAccessIdentityProviders,
            label: t('in-settings:tabs.identityProviders'),
            component: IdentityProviders,
            subPages: [
              props.isGoogleSSOAvailable && {
                path: securityAndAccessGoogleSSO,
                component: GoogleSSO
              },
              props.isSamlAvailable && {
                path: securityAndAccessSaml,
                component: Saml
              },
              props.isOidcAvailable && {
                path: securityAndAccessOidc,
                component: OIDC
              },
              props.isLdapAvailable && {
                path: securityAndAccessLdap,
                component: Ldap
              }
            ].filter(Boolean)
          },
          authAvailable &&
            (role as any).canConfigureTeams && {
              path: securityAndAccessGroupMapping,
              label: t('in-settings:tabs.groupMapping'),
              component: GroupMapping
            },

          (role as any).canConfigureSessionSettings && {
            path: securityAndAccessTimeouts,
            label: t('in-settings:tabs.sessionTimeouts'),
            component: SessionSettings
          }
        ].filter(Boolean)
      }
    ];
  } else {
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
}
