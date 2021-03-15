/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import ViewSwitcher from 'in-infrastructure/tableView/components/ViewSwitcher';
import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import Dashboard from 'in-infrastructure/Dashboard';
import useObservable from 'in-hooks/useObservable';
import { noop } from 'in-services/util/function';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';

export default function InfraPageHeaderWithTabs({
  children,
  showSearchBar,
  theme = themes.dark,
  addShadow,
  addFooter,
  onTypeSelected = noop
}) {
  const isInfraExploreActive = useObservable(isInfraExploreView, []);

  return (
    <Switch>
      <Route path={'*/dashboard'} component={Dashboard} />
      <Route
        path="/*"
        render={() => {
          return (
            <Sticky
              header={
                <>
                  <DashboardHeader
                    theme={theme}
                    contextConfigurations={[
                      { renderContext: () => 'Infrastructure', contextIcon: 'lib_infrastructure' }
                    ]}
                    label={isInfraExploreActive ? <TypeSelector onTypeSelected={onTypeSelected} /> : undefined}
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
