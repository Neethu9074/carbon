/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import ViewSwitcher from 'in-infrastructure/tableView/components/ViewSwitcher';
import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import Dashboard from 'in-infrastructure/Dashboard';
import { noop } from 'in-services/util/function';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

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
                      {
                        renderContext: () => t('in-infrastructure:dashboard.infrastructure'),
                        contextIcon: 'lib_infrastructure'
                      }
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
