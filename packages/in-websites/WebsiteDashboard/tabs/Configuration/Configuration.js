import { Route, Switch } from 'react-router-dom';
import React from 'react';

import {
  configurationOptionsFullyQualified,
  configurationJsStackTraceTranslationFullyQualified
} from 'in-websites/navigation/paths';
import StackTraceTranslation from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/StackTraceTranslation';
import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation/SideNavigation';
import { getModifiedUrlStream, navigationParameters$ } from 'in-stores/navigation/navigation';
import RedirectWithHash from 'in-components/RedirectWithHash';
import Options from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/Options';
import StickySidebarContainer from 'in-new-components/layout/StickySidebarContainer';
import Footer from 'in-new-components/Footer';
import connectTo from 'in-hoc/connectTo';

const NavigationItem = connectTo(({ path }) => ({
  href: getModifiedUrlStream(params => (params.pathname = path)),
  isActive: navigationParameters$.map(params => params.pathname.startsWith(path))
}))(function NavigationItem({ href, label, isActive }) {
  return <SideNavigationItem omitEmptyIcon label={label} href={href} isActive={isActive} />;
});

export default function Configuration(props) {
  const sidebar = (
    <SideNavigation title="Configuration">
      <NavigationItem label="Options" path={configurationOptionsFullyQualified} />
      <NavigationItem label="JS Stack Trace Translation" path={configurationJsStackTraceTranslationFullyQualified} />
    </SideNavigation>
  );
  return (
    <StickySidebarContainer sidebar={sidebar}>
      <Switch>
        <Route path={configurationOptionsFullyQualified} render={() => <Options {...props} lg={7} lgOffset={1} />} />
        <Route
          path={configurationJsStackTraceTranslationFullyQualified}
          render={() => <StackTraceTranslation {...props} />}
        />
        <RedirectWithHash
          to$={getModifiedUrlStream(params => (params.pathname = configurationOptionsFullyQualified))}
        />
      </Switch>
      <Footer />
    </StickySidebarContainer>
  );
}
