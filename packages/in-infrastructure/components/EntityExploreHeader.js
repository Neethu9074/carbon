/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Switch, Route } from 'react-router-dom';
import React from 'react';

import { PreviewPill, SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import { infraExplorePath, defaultInfraExploreViewParams } from 'in-infrastructure/navigation/paths';
import { useLinkToExplore as useLinkToInfraEntityExplore } from 'in-infrastructure/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule from 'in-components/DashboardHeader/DashboardHeaderModule';
import TypeSelector from 'in-infrastructure/Explore/components/TypeSelector';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { customEntitiesViewEnabled } from 'in-services/featureFlags';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import AnalyzeHeader from 'in-analyze/components/AnalyzeHeader';
import Dashboard from 'in-infrastructure/Dashboard';
import { noop } from 'in-services/util/function';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

export default function EntityExploreHeader({
  children,
  addFooter,
  onTypeSelected = noop,
  headerHref$,
  onHeaderClick,
  renderTypeSelector = true,
  onTabChange = noop
}) {
  const headerLabel = renderTypeSelector ? <TypeSelector onHrefSideEffect={onTypeSelected} /> : undefined;
  const { location } = useNavigation();
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();

  const isCustomEntitiesActive = getMatrixParameter(location, infraExplorePath, 'type') === 'customEntities';
  const customEntityModel = getMatrixParameter(location, infraExplorePath, 'customEntityModel');

  const contextConfigurations = renderTypeSelector
    ? [
        {
          renderContext: () => t('in-analyze:analyzeHeader.analyzeInfrastructureSelectedTitle'),
          contextIcon: 'lib_analyze_inverted'
        }
      ]
    : undefined;

  // Create URLs that clear customEntityModel when switching tabs
  const entitiesHref = getLinkToInfraEntityExplore({
    ...defaultInfraExploreViewParams,
    customEntityModel: undefined // Explicitly clear customEntityModel
  });

  const customEntitiesHref = getLinkToInfraEntityExplore({
    type: 'customEntities',
    customEntityModel: undefined // Explicitly clear customEntityModel
  });

  return (
    <Switch>
      <Route path={'*/dashboard'} component={Dashboard} />
      <Route path="/*">
        <Sticky
          header={
            <>
              <AnalyzeHeader
                contextConfigurations={contextConfigurations}
                label={headerLabel}
                headerHref$={headerHref$}
                onHeaderClick={onHeaderClick}
                withoutShadow
              />
              {customEntitiesViewEnabled && (
                <>
                  <DashboardHeaderModule>
                    <SecondLevelNavigation>
                      <SecondLevelNavigationItem
                        label="Entities"
                        href={entitiesHref}
                        isActive={!isCustomEntitiesActive}
                        onClick={() => {
                          // Clear customEntityModel when switching to Entities tab
                          if (customEntityModel) {
                            onTabChange({ customEntityModel: undefined, type: undefined });
                          }
                        }}
                      />
                      <SecondLevelNavigationItem
                        label={
                          <>
                            {'Custom Entities'} <PreviewPill />
                          </>
                        }
                        href={customEntitiesHref}
                        isActive={isCustomEntitiesActive}
                        onClick={() => {
                          // Clear customEntityModel when switching to Custom Entities tab
                          if (customEntityModel) {
                            onTabChange({ customEntityModel: undefined, type: 'customEntities' });
                          }
                        }}
                      />
                    </SecondLevelNavigation>
                  </DashboardHeaderModule>
                  <DashboardHeaderShadowModule />
                </>
              )}
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
