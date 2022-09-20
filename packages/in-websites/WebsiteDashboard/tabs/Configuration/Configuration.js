/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Route, Switch } from 'react-router-dom';
import React from 'react';

import {
  configurationOptionsFullyQualified,
  configurationJsStackTraceTranslationFullyQualified,
  configurationPrivacyFullyQualified,
  configurationCustomGeoDetailsFullyQualified
} from 'in-websites/navigation/paths';
import WebsiteCustomGeoDetails from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/WebsiteCustomGeoDetails';
import StackTraceTranslation from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/StackTraceTranslation';
import { SideNavigation, SideNavigationItem } from 'in-components/SideNavigation/SideNavigation';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import Options from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Options';
import Privacy from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Privacy';
import SidebarContainer from 'in-components/layout/SidebarContainer';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Footer from 'in-components/Footer';
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
    <SideNavigation title={t('in-websites:websiteDashboard.tabs.configuration.configurationTitle')}>
      <NavigationItem
        label={t('in-websites:websiteDashboard.tabs.configuration.configurationLabelOptions')}
        path={configurationOptionsFullyQualified}
      />
      <NavigationItem
        label={t('in-websites:websiteDashboard.tabs.configuration.configurationLabelPrivacy')}
        path={configurationPrivacyFullyQualified}
      />
      <NavigationItem
        label={t('in-websites:websiteDashboard.tabs.configuration.configurationLabelJSStackTraceTranslation')}
        path={configurationJsStackTraceTranslationFullyQualified}
      />
      <NavigationItem
        label={t('in-websites:websiteDashboard.tabs.configuration.configurationLabelCustomGeoDetails')}
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
          <WebsiteCustomGeoDetails {...props} />
        </Route>
        <Route path={configurationJsStackTraceTranslationFullyQualified}>
          <StackTraceTranslation {...props} />
        </Route>
        <Route>
          <RedirectWithHash
            to$={getModifiedUrlStream(params => (params.pathname = configurationOptionsFullyQualified))}
          />
        </Route>
      </Switch>
      <Footer />
    </SidebarContainer>
  );
}
