// @flow
import React from 'react';

import { authSettings, googleSSO, saml, ldap, samlMapping, ldapMapping } from 'in-settings/navigation/paths';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import SamlMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Saml/Saml';
import LdapMapping from 'in-settings/tabs/AuthSettings/pages/mappings/Ldap/Ldap';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';

function navigationTreeForRole(): NavigationTree {
  const navigationTree = [
    {
      title: 'Identity Providers',
      pages: [
        {
          path: googleSSO,
          label: 'Google SSO',
          component: GoogleSSO
        },
        {
          path: saml,
          label: 'SAML',
          component: Saml
        },
        {
          path: ldap,
          label: 'LDAP',
          component: Ldap
        }
      ]
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

export default function View(props: any) {
  return (
    <SideNavigationAndContent
      stickySidebar
      navigationTree={navigationTreeForRole()}
      redirectToDefaultPage={googleSSO}
      redirectFrom={authSettings}
      NotFoundPage={NotFoundPage}
      {...props}
    />
  );
}
