/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

const GlobeViewLoader = () =>
  import(/* webpackChunkName: "globe-view" */ 'in-websites/WebsiteDashboard/components/GlobeView');
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import getMobileAppCountryBreakdown from 'in-mobile-apps/subscriptions/getMobileAppCountryBreakdown';
import TwoDMobileAppGeoMap from 'in-mobile-apps/MobileAppDashboard/tabs/Geography/2DMobileAppGeoMap';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { mobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import Button from 'in-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Geography.mless';

const GlobeView = createAsyncViewComponent(GlobeViewLoader);

export default function Geography(props) {
  const { tagFilters, timeConfig } = props;
  useDisabledBodyScroll();
  const { createHrefToPath } = useNavigation();

  return (
    <WithEmptyStateFallback
      getHasDataToRender={() => getHasDataToRender(props)}
      title={t('in-mobile-apps:dashboard.tabs.noSessionTitle')}
      explanation={
        tagFilters && tagFilters.length > 1
          ? t('in-mobile-apps:dashboard.tabs.noSessionExplanationWithFilters')
          : t('in-mobile-apps:dashboard.tabs.noSessionExplanation')
      }
    >
      <div className={locals.wrapper}>
        <FullHeightWrapper
          render={height => (
            <Switch>
              <Route path={`${mobileAppPathFullyQualified}/geography/globe`}>
                <div className={locals.globeWrapper}>
                  <GlobeView
                    customHeight={height}
                    tagFilters={tagFilters}
                    timeConfig={timeConfig}
                    getData$={getData$}
                    getValue={v => v.sessions}
                  />
                  <Tooltip content={t('in-mobile-apps:dashboard.tabs.switchTo2DTooltip')} align="leftMiddle">
                    <Button
                      dark
                      href={createHrefToPath(`${mobileAppPathFullyQualified}/geography`)}
                      className={locals.to2D}
                      renderContent={() => <span>{t('in-mobile-apps:dashboard.tabs.2DBtn')}</span>}
                    />
                  </Tooltip>
                  <p className={locals.footerText}>{t('in-mobile-apps:dashboard.tabs.globViewFootertext')}</p>
                </div>
              </Route>
              <Route path={`${mobileAppPathFullyQualified}/geography`}>
                <div>
                  <TwoDMobileAppGeoMap
                    tagFilters={tagFilters}
                    timeConfig={timeConfig}
                    height={height}
                    controlWrapperClassName={locals.controlWrapperClassName}
                  />
                  <Tooltip content={t('in-mobile-apps:dashboard.tabs.switchTo3DTooltip')} align="leftMiddle">
                    <Button
                      href={createHrefToPath(`${mobileAppPathFullyQualified}/geography/globe`)}
                      className={locals.to3D}
                      renderContent={() => <span>{t('in-mobile-apps:dashboard.tabs.3DBtn')}</span>}
                    />
                  </Tooltip>
                </div>
              </Route>
            </Switch>
          )}
        />
      </div>
    </WithEmptyStateFallback>
  );
}

function getData$({ timeConfig, tagFilters }) {
  const tagFiltersInclSessionStartFilter = tagFilters.concat({
    name: 'mobileBeacon.type',
    operator: 'EQUALS',
    stringValue: 'sessionStart'
  });

  return getMobileAppCountryBreakdown({
    timeConfig,
    tagFilters: tagFiltersInclSessionStartFilter,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'countryName',
      direction: 'ASC'
    }
  });
}

function getHasDataToRender(props) {
  return getData$(props).map(result => !result.data || result.data.totalHits > 0);
}
