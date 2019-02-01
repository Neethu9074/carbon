import { generatePath, matchPath } from 'react-router';
import React from 'react';

import { settingsBasePath, teamSettings } from 'in-views/configurationView/navigation/paths';
import RedirectWithHash from 'in-components/Navigation/RedirectWithHash/RedirectWithHash';
import legacyRedirects from 'in-views/configurationView/navigation/legacy-redirects';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import tabs from 'in-views/configurationView/tabs/index';

export default function ConfigurationView(props) {
  const { location } = props;
  if (location.pathname && location.pathname === settingsBasePath) {
    // in-components/AppHeader/components/AccountMenu/components/Menu (and possibly old bookmarks) just points to
    // /config, we redirect this to the default tab (team settings).
    return <RedirectWithHash props={props} to={teamSettings} />;
  }

  // redirects for pre-2019 config paths (to support old bookmarks and links in docs etc.)
  for (let i = 0; i < legacyRedirects.length; i++) {
    const match = matchPath(location.pathname, legacyRedirects[i].from);
    if (match && match.isExact) {
      return createLegacyRedirect(legacyRedirects[i], match, props);
    }
  }

  return <TabView HeaderComponent={Header} location={props.location} tabs={tabs} props={props} />;
}

function Header(props) {
  return <BasicDashboardHeader title="Settings" icon="lib_actions_settings" {...props} />;
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
