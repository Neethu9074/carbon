/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/legacy';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import ViewSwitcher from 'in-infrastructure/tableView/components/ViewSwitcher';
import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import { defaultInfraExploreView } from 'in-infrastructure/navigation/paths';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import Dashboard from 'in-infrastructure/Dashboard';
import { noop } from 'in-services/util/function';
import Pill from 'in-components/Pill/Pill';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './InfraAnalyticsBeta.mless';

function renderButtonLine() {
  return (
    <div className={locals.betaMarker}>
      <Link className={locals.betaLink} href$={defaultInfraExploreView}>
        <Pill kind="primary" className={locals.betaPill}>
          {t('in-infrastructure:explore.beta')}
        </Pill>
        {t('in-infrastructure:explore.tryBetaInfraAnalytics')}
      </Link>
    </div>
  );
}

export default function InfraPageHeaderWithTabs({
  children,
  showSearchBar,
  theme = themes.dark,
  addShadow,
  addFooter,
  onTypeSelected = noop,
  headerHref$,
  onHeaderClick,
  renderTypeSelector = true
}) {
  const isInfraExploreActive = useObservable(isInfraExploreView, []);

  return (
    <Switch>
      <Route path={'*/dashboard'} component={Dashboard} />
      <Route path="/*">
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
                renderButtonLine={hasInfrastructureAnalyzeAccess ? renderButtonLine : undefined}
                label={
                  isInfraExploreActive && renderTypeSelector ? (
                    <TypeSelector onTypeSelected={onTypeSelected} />
                  ) : undefined
                }
                headerHref$={headerHref$}
                onHeaderClick={onHeaderClick}
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
      </Route>
    </Switch>
  );
}
