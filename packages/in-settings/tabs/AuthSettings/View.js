// @flow
import React from 'react';

import { authSettings, googleSSO, saml, ldap, samlMapping, ldapMapping } from 'in-settings/navigation/paths';
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
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import connectTo from 'in-hoc/connectTo';

function getNavigationTree(props: any): NavigationTree {
  const navigationTree = [
    {
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
    }
  ];
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
    return (
      <SideNavigationAndContent
        stickySidebar
        navigationTree={getNavigationTree(props)}
        redirectToDefaultPage={googleSSO}
        redirectFrom={authSettings}
        NotFoundPage={NotFoundPage}
        {...props}
      />
    );
  }
);
