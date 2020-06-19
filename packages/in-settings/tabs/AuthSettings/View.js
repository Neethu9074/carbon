// @flow
import React from 'react';

import {
  authSettings,
  googleSSO,
  saml,
  ldap,
  twoFaUsers,
  samlMapping,
  ldapMapping
} from 'in-settings/navigation/paths';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import { isAvailable as isSamlAvailable } from 'in-settings/tabs/AuthSettings/api/saml';
import { isAvailable as isLdapAvailable } from 'in-settings/tabs/AuthSettings/api/ldap';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import SamlMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Saml/Saml';
import LdapMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Ldap/Ldap';
import Users from 'in-settings/tabs/AuthSettings/pages/twoFactorAuth/Users';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import { isOwner, role } from 'in-stores/user';
import connectTo from 'in-hoc/connectTo';

function getNavigationTree(props: any): NavigationTree {
  const navigationTree = [
    isAtLeastOneAuthMethogAvailable(props) && {
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
    isOwner && {
      title: '2Factor',
      pages: [
        {
          path: twoFaUsers,
          label: 'Users',
          component: Users
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
    isLdapAvailable: isLdapAvailable()
  },

  function View(props: any) {
    let defaultRedirect = twoFaUsers;
    if (isAtLeastOneAuthMethogAvailable(props)) {
      if (props.isGoogleSSOAvailable) {
        defaultRedirect = googleSSO;
      } else if (props.isSamlAvailable) {
        defaultRedirect = saml;
      } else {
        defaultRedirect = ldap;
      }
    }
    return (
      <SideNavigationAndContent
        stickySidebar
        navigationTree={getNavigationTree(props)}
        redirectToDefaultPage={defaultRedirect}
        redirectFrom={authSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
    );
  }
);

function isAtLeastOneAuthMethogAvailable({
  isInternalVisible,
  isGoogleSSOAvailable,
  isSamlAvailable,
  isLdapAvailable
}) {
  return (
    isInternalVisible &&
    role.canConfigureAuthenticationMethods &&
    (isGoogleSSOAvailable || isSamlAvailable || isLdapAvailable)
  );
}
