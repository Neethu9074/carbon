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
  groupMapping,
  twoFactorAuth,
  changePassword,
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
import StickySidebarNavigationAndContent from 'in-components/layout/SideNavigationAndContent/StickySidebarNavigationAndContent';
import { isAvailable as isChangePasswordAvailable } from 'in-settings/tabs/AuthSettings/api/changePassword';
import GroupMapping from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GroupMapping/GroupMapping';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import SessionSettings from 'in-settings/tabs/AuthSettings/pages/sessionSettings/SessionSettings';
import TwoFactorSettings from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Settings';
import ChangePassword from 'in-settings/tabs/AuthSettings/pages/password/ChangePassword';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import OIDC from 'in-settings/tabs/AuthSettings/pages/indentityProviders/OIDC/OIDC';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function getNavigationTree(props) {
  const isAtLeastOneAuthMethodAvailable =
    props.isGoogleSSOAvailable || props.isSamlAvailable || props.isLdapAvailable || props.isOidcAvailable;

  const showPassword = props.isChangePasswordAvailable;

  const navigationTree = [
    showPassword && {
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
          {
            path: groupMapping,
            label: t('in-settings:tabs.groupMapping'),
            component: GroupMapping
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
    oidcConfig: getOidcConfig(),
    isChangePasswordAvailable: isChangePasswordAvailable()
  },

  function View(props) {
    return (
      <Fragment>
        <StickySidebarNavigationAndContent
          navigationTree={getNavigationTree(props)}
          redirectToDefaultPage={getDefaultPage(
            props.isGoogleSSOAvailable,
            props.isSamlAvailable,
            props.isLdapAvailable,
            props.isChangePasswordAvailable
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

function getDefaultPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable, isChangePasswordAvailable) {
  if (isChangePasswordAvailable) {
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
