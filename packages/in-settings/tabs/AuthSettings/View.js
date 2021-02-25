/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import {
  authSettings,
  googleSSO,
  saml,
  ldap,
  twoFactorAuth,
  twoFaUsers,
  changePassword,
  samlMapping,
  ldapMapping,
  timeouts
} from 'in-settings/navigation/paths';
import { isAvailable as isSamlAvailable, getConfigAsResultObservable } from 'in-settings/tabs/AuthSettings/api/saml';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import SessionSettings from 'in-settings/tabs/AuthSettings/pages/sessionSettings/SessionSettings';
import TwoFactorSettings from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Settings';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import ChangePassword from 'in-settings/tabs/AuthSettings/pages/password/ChangePassword';
import { isAvailable as isLdapAvailable } from 'in-settings/tabs/AuthSettings/api/ldap';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import SamlMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Saml/Saml';
import LdapMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Ldap/Ldap';
import Users from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Users';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { isOwner, role } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';

function getNavigationTree(props) {
  const isAtLeastOneAuthMethogAvailable = props.isGoogleSSOAvailable || props.isSamlAvailable || props.isLdapAvailable;
  const isSamlActivated = props.samlConfig.data?.activated;

  const navigationTree = [
    !isSamlActivated && {
      title: 'Password',
      pages: [
        {
          path: changePassword,
          label: 'Change',
          component: ChangePassword
        }
      ]
    },

    isAtLeastOneAuthMethogAvailable && {
      title: 'Identity Providers',
      pages: [
        props.isGoogleSSOAvailable && {
          path: googleSSO,
          label: 'Google SSO',
          component: GoogleSSO
        },
        props.isSamlAvailable && {
          path: saml,
          label: 'SAML',
          component: Saml
        },
        props.isLdapAvailable && {
          path: ldap,
          label: 'LDAP',
          component: Ldap
        }
      ].filter(Boolean)
    },

    {
      title: 'Two-Factor',
      pages: [
        {
          path: twoFactorAuth,
          label: 'Settings',
          component: TwoFactorSettings
        },
        isOwner && {
          path: twoFaUsers,
          label: 'Users',
          component: Users
        }
      ].filter(Boolean)
    },

    role.canConfigureSessionSettings && {
      title: 'Session',
      pages: [
        {
          path: timeouts,
          label: 'Timeouts',
          component: SessionSettings
        }
      ]
    }
  ].filter(Boolean);

  if (__DEV__) {
    navigationTree.push({
      title: 'Mapping',
      pages: [
        {
          path: ldapMapping,
          label: 'LDAP Mapping',
          component: LdapMapping
        },
        {
          path: samlMapping,
          label: 'SAML Mapping',
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
    samlConfig: getConfigAsResultObservable(),
    isLdapAvailable: isLdapAvailable()
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
            props.samlConfig
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

function getDefaultPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable, samlConfig) {
  if (!samlConfig.data?.activated) {
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
