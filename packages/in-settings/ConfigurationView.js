import { generatePath, matchPath } from 'react-router';
import React from 'react';

import { settingsBasePath, teamSettings, userSettingsGeneral, ampSettings } from 'in-settings/navigation/paths';
import { isAvailable as isGoogleSSOAvailable } from 'in-settings/tabs/AuthSettings/api/googleSSO';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash/RedirectWithHash';
import { isAvailable as isSamlAvailable } from 'in-settings/tabs/AuthSettings/api/saml';
import { isAvailable as isLdapAvailable } from 'in-settings/tabs/AuthSettings/api/ldap';
import { roleHasAnyTeamPermissions } from 'in-settings/tabs/permissions';
import legacyRedirects from 'in-settings/navigation/legacy-redirects';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import DashboardHeader from 'in-new-components/DashboardHeader';
import getTabs from 'in-settings/tabs/index';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isGoogleSSOAvailable: isGoogleSSOAvailable(),
    isSamlAvailable: isSamlAvailable(),
    isLdapAvailable: isLdapAvailable()
  },
  function ConfigurationView(props) {
    const { location } = props;
    if (location.pathname && location.pathname === settingsBasePath) {
      // in-components/AppHeader/components/AccountMenu/components/Menu (and possibly old bookmarks) just points to
      // /config, we redirect this to the default tab (team settings).
      return <RedirectWithHash props={props} to={roleHasAnyTeamPermissions() ? teamSettings : userSettingsGeneral} />;
    }

    // redirects for pre-2019 config paths (to support old bookmarks and links in docs etc.)
    for (let i = 0; i < legacyRedirects.length; i++) {
      const match = matchPath(location.pathname, legacyRedirects[i].from);
      if (match && match.isExact) {
        return createLegacyRedirect(legacyRedirects[i], match, props);
      }
    }

    return <TabView HeaderComponent={Header} location={props.location} tabs={getTabs()} props={props} />;
  }
);

function Header(props) {
  const isAmpView = props.location.pathname.indexOf(ampSettings) >= 0;
  return (
    <DashboardHeader
      {...props}
      title="Settings"
      icon="lib_actions_settings"
      label="Settings"
      renderTimeSelection={isAmpView ? () => null : undefined}
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
