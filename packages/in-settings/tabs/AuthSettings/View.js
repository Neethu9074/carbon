/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import {
  authSettings,
  googleSSO,
  saml,
  oidc,
  ldap,
  twoFactorAuth,
  twoFaUsers,
  changePassword,
  samlMapping,
  ldapMapping,
  timeouts
} from 'in-settings/navigation/paths';
import {
  isAvailable as isSamlAvailable,
  getConfigAsResultObservable as getSamlConfig
} from 'in-settings/tabs/AuthSettings/api/saml';
import {
  isAvailable as isLdapAvailable,
  getConfigAsResultObservable as getLdapConfig
} from 'in-settings/tabs/AuthSettings/api/ldap';
import {
  isAvailable as isOidcAvailable,
  getConfigAsResultObservable as getOidcConfig
} from 'in-settings/tabs/AuthSettings/api/oidc';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import SessionSettings from 'in-settings/tabs/AuthSettings/pages/sessionSettings/SessionSettings';
import TwoFactorSettings from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Settings';
import ChangePassword from 'in-settings/tabs/AuthSettings/pages/password/ChangePassword';
import SideNavigationAndContent from 'in-components/layout/SideNavigationAndContent';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import OIDC from 'in-settings/tabs/AuthSettings/pages/indentityProviders/OIDC/OIDC';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import SamlMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Saml/Saml';
import LdapMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Ldap/Ldap';
import Users from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Users';
import { authenticationOidcEnabled } from 'in-services/featureFlags';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { isOwner, role } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

function getNavigationTree(props) {
  const isAtLeastOneAuthMethodAvailable =
    props.isGoogleSSOAvailable || props.isSamlAvailable || props.isLdapAvailable || props.isOidcAvailable;
  const hidePassword =
    props.samlConfig.data?.activated || props.oidcConfig.data?.activated || props.ldapConfig.data?.url;

  const navigationTree = [
    hidePassword !== undefined &&
      !hidePassword && {
        title: t('in-settings:tabs.password'),
        pages: [
          {
            path: changePassword,
            label: t('in-settings:tabs.change'),
            component: ChangePassword
          }
        ]
      },

    role.canConfigureAuthenticationMethods &&
      isAtLeastOneAuthMethodAvailable && {
        title: t('in-settings:tabs.identityProviders'),
        pages: [
          props.isGoogleSSOAvailable && {
            path: googleSSO,
            label: t('in-settings:tabs.googleSso'),
            component: GoogleSSO
          },
          props.isSamlAvailable && {
            path: saml,
            label: t('in-settings:tabs.saml'),
            component: Saml
          },
          props.isOidcAvailable &&
            authenticationOidcEnabled && {
              path: oidc,
              label: t('in-settings:tabs.oidc'),
              component: OIDC
            },
          props.isLdapAvailable && {
            path: ldap,
            label: t('in-settings:tabs.ldap'),
            component: Ldap
          }
        ].filter(Boolean)
      },

    {
      title: t('in-settings:tabs.twoFactor'),
      pages: [
        {
          path: twoFactorAuth,
          label: t('in-settings:tabs.settings'),
          component: TwoFactorSettings
        },
        isOwner && {
          path: twoFaUsers,
          label: t('in-settings:tabs.users'),
          component: Users
        }
      ].filter(Boolean)
    },

    role.canConfigureSessionSettings && {
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

  if (__DEV__) {
    navigationTree.push({
      title: t('in-settings:tabs.mapping'),
      pages: [
        {
          path: ldapMapping,
          label: t('in-settings:tabs.ldapMapping'),
          component: LdapMapping
        },
        {
          path: samlMapping,
          label: t('in-settings:tabs.samlMapping'),
          component: SamlMapping
        }
      ]
    });
  }
  return navigationTree;
}

export default connectTo(
  {
    isGoogleSSOAvailable: isGoogleSSOAvailable(),
    isSamlAvailable: isSamlAvailable(),
    samlConfig: getSamlConfig(),
    isLdapAvailable: isLdapAvailable(),
    ldapConfig: getLdapConfig(),
    isOidcAvailable: isOidcAvailable(),
    oidcConfig: getOidcConfig()
  },

  function View(props) {
    return (
      <Fragment>
        <SideNavigationAndContent
          stickySidebar
          navigationTree={getNavigationTree(props)}
          redirectToDefaultPage={getDefaultPage(
            props.isGoogleSSOAvailable,
            props.isSamlAvailable,
            props.isLdapAvailable,
            props.samlConfig,
            props.oidcConfig,
            props.ldapConfig
          )}
          redirectFrom={authSettings}
          NotFoundPage={NotFoundPage}
          {...props}
        />
        <SetBodyColor color="#fff" />
      </Fragment>
    );
  }
);

function getDefaultPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable, samlConfig, oidcConfig, ldapConfig) {
  const hidePassword = samlConfig.data?.activated || oidcConfig.data?.activated || ldapConfig.data?.url;
  if (hidePassword !== undefined && !hidePassword) {
    return changePassword;
  }

  if (isGoogleSSOAvailable) {
    return googleSSO;
  }

  if (isSamlAvailable) {
    return saml;
  }

  if (isLdapAvailable) {
    return ldap;
  }

  return twoFactorAuth;
}
