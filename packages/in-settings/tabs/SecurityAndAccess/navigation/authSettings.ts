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
  securityAndAccessRoleMapping,
  securityAndAccessTimeouts,
  securityAndAccessIdentityProviders
} from 'in-settings/navigation/paths';
//@ts-expect-error not migrated to typescript yet
import SessionSettings from 'in-settings/tabs/SecurityAndAccess/pages/sessionSettings/SessionSettings';
import GroupMapping from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GroupMapping/GroupMapping';
import RoleMapping from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/RoleMapping/RoleMapping';
import IdentityProviders from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/identityProviders';
import GoogleSSO from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/GoogleSSO/GoogleSSO';
import Saml from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Saml/Saml';
import OIDC from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/OIDC/OIDC';
import Ldap from 'in-settings/tabs/SecurityAndAccess/pages/identityProviders/Ldap/Ldap';
import { isAnyIdpAvailable, isIdpAvailable } from 'in-settings/utils/idp';
import { ViewProps } from 'in-settings/tabs/SecurityAndAccess/View';
import { idpConfigV2Enabled } from 'in-services/featureFlags';
import { Role } from 'in-types';
import { t } from 'in-i18n';

interface GetNavigationTreeForAuthenticationProps extends ViewProps {
  role: Role;
  isRbacTeamsAvailable?: boolean;
}

export function getNavigationTreeForAuthentication({
  sso,
  ldap,
  oidc,
  saml,
  role,
  isRbacTeamsAvailable
}: GetNavigationTreeForAuthenticationProps) {
  const authAvailable = role.canConfigureAuthenticationMethods && isAnyIdpAvailable({ sso, ldap, oidc, saml });

  if (idpConfigV2Enabled) {
    return [
      {
        title: t('in-settings:tabs.authentication'),
        pages: [
          authAvailable && {
            path: securityAndAccessIdentityProviders,
            label: t('in-settings:tabs.identityProviders'),
            component: IdentityProviders
          },
          authAvailable &&
            !isRbacTeamsAvailable &&
            role?.canConfigureTeams && {
              path: securityAndAccessGroupMapping,
              label: t('in-settings:tabs.groupMapping'),
              component: GroupMapping
            },
          authAvailable &&
            isRbacTeamsAvailable &&
            role?.canConfigureTeams && {
              path: securityAndAccessRoleMapping,
              label: t('in-settings:tabs.roleMappingNavigationItem'),
              component: RoleMapping
            },

          role.canConfigureSessionSettings && {
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
          isIdpAvailable(sso) && {
            path: securityAndAccessGoogleSSO,
            label: t('in-settings:tabs.googleSSO.idpTitle'),
            component: GoogleSSO
          },
          isIdpAvailable(saml) && {
            path: securityAndAccessSaml,
            label: t('in-settings:tabs.saml'),
            component: Saml
          },
          isIdpAvailable(oidc) && {
            path: securityAndAccessOidc,
            label: t('in-settings:tabs.oidc'),
            component: OIDC
          },
          isIdpAvailable(ldap) && {
            path: securityAndAccessLdap,
            label: t('in-settings:tabs.ldap'),
            component: Ldap
          },
          role?.canConfigureTeams &&
            !isRbacTeamsAvailable && {
              path: securityAndAccessGroupMapping,
              label: t('in-settings:tabs.groupMapping'),
              component: GroupMapping
            },
          role?.canConfigureTeams &&
            isRbacTeamsAvailable && {
              path: securityAndAccessRoleMapping,
              label: t('in-settings:tabs.roleMappingNavigationItem'),
              component: RoleMapping
            }
        ].filter(Boolean)
      },
      role.canConfigureSessionSettings && {
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
