import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardNavigationRoute from 'in-components/Navigation/DashboardNavigationRoute/DashboardNavigationRoute';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import UseBeeInstantToggle from 'in-components/Dashboard/components/UseBeeInstantToggle';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import ViewSwitcher from 'in-views/tableView/components/ViewSwitcher';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function InfraPageHeaderWithTabs({
  children,
  showSearchBar,
  theme = themes.dark,
  addShadow,
  addFooter
}) {
  return (
    <Switch>
      {DashboardNavigationRoute}
      <Route
        path="/*"
        render={() => {
          return (
            <Sticky
              header={
                <>
                  <DashboardHeader
                    theme={theme}
                    icon="lib_infrastructure"
                    label="Infrastructure"
                    renderTopLevelButtonLine={UseBeeInstantToggle}
                  />
                  <DashboardHeaderModule theme={theme} withBottomBorder>
                    <ViewSwitcher theme={theme} showSearchBar={showSearchBar} />
                  </DashboardHeaderModule>
                  {addShadow && <DashboardHeaderShadowModule />}
                </>
              }
            >
              {children}
              {addFooter && <Footer />}
            </Sticky>
          );
        }}
      />
    </Switch>
  );
}
