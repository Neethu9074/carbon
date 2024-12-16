/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import {
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import ViewSwitcher from 'in-infrastructure/tableView/components/ViewSwitcher';
import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import DashboardHeader, { themes } from 'in-components/DashboardHeader';
import { isInfraExploreView } from 'in-infrastructure/navigation/paths';
import { hasInfrastructureAnalyzeAccess } from 'in-stores/permission';
import { playwithEnabled } from 'in-services/featureFlags';
import Dashboard from 'in-infrastructure/Dashboard';
import { noop } from 'in-services/util/function';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

function ButtonLine() {
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  return (
    <Button
      kind="secondary"
      icon="lib_analyze_inverted"
      href={getLinkToInfraEntityExplore(defaultInfraExploreViewParams)}
      darkTheme
    >
      {t('in-infrastructure:explore.analyzeInfrastructure')}
    </Button>
  );
}

function renderButtonLine() {
  return <ButtonLine />;
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
                renderButtonLine={hasInfrastructureAnalyzeAccess && !playwithEnabled ? renderButtonLine : undefined}
                label={
                  isInfraExploreActive && renderTypeSelector ? (
                    <TypeSelector onHrefSideEffect={onTypeSelected} />
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
