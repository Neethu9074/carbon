/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { generatePath, matchPath } from 'react-router';
import React from 'react';

import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/SecurityAndAccess/api/googleSSO';
import { settingsBasePath, globalSettings, userSettingsGeneral } from 'in-settings/navigation/paths';
import { isAvailable as isSamlAvailable } from 'in-settings/tabs/SecurityAndAccess/api/saml';
import { isAvailable as isLdapAvailable } from 'in-settings/tabs/SecurityAndAccess/api/ldap';
import { isAvailable as isOidcAvailable } from 'in-settings/tabs/SecurityAndAccess/api/oidc';
import { roleHasAnyGlobalPermissions } from 'in-settings/tabs/permissions';
import legacyRedirects from 'in-settings/navigation/legacy-redirects';
import TabView from 'in-components/LocationAwareTabView/TabView';
// @ts-expect-error needs TS migration
import RedirectWithHash from 'in-components/RedirectWithHash';
import DashboardHeader from 'in-components/DashboardHeader';
import getTabs from 'in-settings/tabs/index';
// @ts-expect-error needs TS migration
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isGoogleSSOAvailable: isGoogleSSOAvailable(),
    isSamlAvailable: isSamlAvailable(),
    isLdapAvailable: isLdapAvailable(),
    isOidcAvailable: isOidcAvailable()
  },
  function ConfigurationView(props) {
    const { location } = props;
    if (location.pathname && location.pathname === settingsBasePath) {
      // in-components/AppHeader/components/AccountMenu/components/Menu (and possibly old bookmarks) just points to
      // /config, we redirect this to the default tab (global settings).
      return (
        <RedirectWithHash props={props} to={roleHasAnyGlobalPermissions() ? globalSettings : userSettingsGeneral} />
      );
    }

    // redirects for pre-2019 config paths (to support old bookmarks and links in docs etc.)
    for (let i = 0; i < legacyRedirects.length; i++) {
      const match = matchPath(location.pathname, legacyRedirects[i].from);
      if (match && match.isExact) {
        return createLegacyRedirect(legacyRedirects[i], match, props);
      }
    }

    const tabs = getTabs().map(tab => ({
      ...tab,
      noBottomMargin: true
    }));
    return <TabView HeaderComponent={Header} location={props.location} tabs={tabs} props={props} />;
  }
);

function Header(props) {
  return (
    <DashboardHeader
      {...props}
      title={t('in-settings:settings')}
      icon="lib_actions_settings"
      label={t('in-settings:settings')}
      renderTimeSelection={() => null}
    />
  );
}

function createLegacyRedirect(legacyRedirect, match, props) {
  const params = {};
  const substitutions = legacyRedirect.params || {};
  Object.keys(match.params).forEach(p => {
    const key = substitutions[p] || p;
    params[key] = match.params[p];
  });
  const to = generatePath(legacyRedirect.to, params);
  return <RedirectWithHash props={props} to={to} />;
}
