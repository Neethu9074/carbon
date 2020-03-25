// @flow
import React from 'react';

import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import SideNavigationAndContent from 'in-new-components/layout/SideNavigationAndContent';
import type { NavigationTree } from 'in-new-components/layout/SideNavigationAndContent';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import { authSettings, googleSSO, saml, ldap } from 'in-settings/navigation/paths';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';

function navigationTreeForRole(): NavigationTree {
  return [
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
