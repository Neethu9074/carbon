/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import {
  configurationOptionsFullyQualified,
  configurationPrivacyFullyQualified,
  configurationCustomGeoDetailsFullyQualified
} from 'in-mobile-apps/navigation/paths';
import MobileAppCustomGeoDetails from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/MobileAppCustomGeoDetails';
import { SideNavigation, SideNavigationItem } from 'in-components/SideNavigation/SideNavigation';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import Options from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Options';
import Privacy from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Privacy';
import SidebarContainer from 'in-components/layout/SidebarContainer';
import RedirectWithHash from 'in-components/RedirectWithHash';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const NavigationItem = connectTo(({ path }) => ({
  href: getModifiedUrlStream(params => (params.pathname = path)),
  isActive: navigationParameters$.map(params => params.pathname.startsWith(path))
}))(function NavigationItem({ href, label, isActive }) {
  return <SideNavigationItem omitEmptyIcon label={label} href={href} isActive={isActive} />;
});

export default function Configuration(props) {
  const sidebar = (
    <SideNavigation title={t('in-mobile-apps:dashboard.tabs.configurationTitle')}>
      <NavigationItem
        label={t('in-mobile-apps:dashboard.tabs.optionsLabel')}
        path={configurationOptionsFullyQualified}
      />
      <NavigationItem
        label={t('in-mobile-apps:dashboard.tabs.privacyLabel')}
        path={configurationPrivacyFullyQualified}
      />
      <NavigationItem
        label={t('in-mobile-apps:dashboard.tabs.customGeoDetailsLabel')}
        path={configurationCustomGeoDetailsFullyQualified}
      />
    </SideNavigation>
  );
  return (
    <SidebarContainer sidebar={sidebar}>
      <Switch>
        <Route path={configurationOptionsFullyQualified}>
          <Options {...props} />
        </Route>
        <Route path={configurationPrivacyFullyQualified}>
          <Privacy {...props} />
        </Route>
        <Route path={configurationCustomGeoDetailsFullyQualified}>
          <MobileAppCustomGeoDetails {...props} />
        </Route>
        <Route>
          <RedirectWithHash
            to$={getModifiedUrlStream(params => (params.pathname = configurationOptionsFullyQualified))}
          />
        </Route>
      </Switch>
    </SidebarContainer>
  );
}
