/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

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
import { authSettings, googleSSO, saml, oidc, ldap, groupMapping, timeouts } from 'in-settings/navigation/paths';
import GroupMapping from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GroupMapping/GroupMapping';
import GoogleSSO from 'in-settings/tabs/AuthSettings/pages/indentityProviders/GoogleSSO/GoogleSSO';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import SessionSettings from 'in-settings/tabs/AuthSettings/pages/sessionSettings/SessionSettings';
import Saml from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Saml/Saml';
import OIDC from 'in-settings/tabs/AuthSettings/pages/indentityProviders/OIDC/OIDC';
import Ldap from 'in-settings/tabs/AuthSettings/pages/indentityProviders/Ldap/Ldap';
import NotFoundPage from 'in-settings/tabs/pages/NotFound';
import SetBodyColor from 'in-components/SetBodyColor';
import { getInvitations$ } from 'in-api/users';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

function getNavigationTree(props) {
  const authAvailable =
    role.canConfigureAuthenticationMethods &&
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
        role.canConfigureTeams && {
          path: groupMapping,
          label: t('in-settings:tabs.groupMapping'),
          component: GroupMapping
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
    invitations: getInvitations$()
  },

  function View(props) {
    return (
      <Fragment>
        <StickySidebarNavigationAndContent
          navigationTree={getNavigationTree(props)}
          redirectToDefaultPage={getDefaultPage(
            props.isGoogleSSOAvailable,
            props.isSamlAvailable,
            props.isLdapAvailable
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

function getDefaultPage(isGoogleSSOAvailable, isSamlAvailable, isLdapAvailable) {
  if (role.canConfigureAuthenticationMethods) {
    if (isGoogleSSOAvailable) {
      return googleSSO;
    }

    if (isSamlAvailable) {
      return saml;
    }

    if (isLdapAvailable) {
      return ldap;
    }
  }
  if (role.canConfigureTeams) {
    return groupMapping;
  }
  if (role.canConfigureSessionSettings) {
    return timeouts;
  }
  return null;
}
