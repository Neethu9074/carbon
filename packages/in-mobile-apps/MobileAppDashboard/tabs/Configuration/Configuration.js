/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Route, Switch } from 'react-router-dom';
import { t } from 'in-i18n';
import React from 'react';

import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import Options from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/Options';
import { configurationOptionsFullyQualified } from 'in-mobile-apps/navigation/paths';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import RedirectWithHash from 'in-components/RedirectWithHash';
import connectTo from 'in-hoc/connectTo';

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
    </SideNavigation>
  );
  return (
    <StickySidebarContainer sidebar={sidebar}>
      <Switch>
        <Route path={configurationOptionsFullyQualified} render={() => <Options {...props} />} />
        <RedirectWithHash
          to$={getModifiedUrlStream(params => (params.pathname = configurationOptionsFullyQualified))}
        />
      </Switch>
    </StickySidebarContainer>
  );
}
