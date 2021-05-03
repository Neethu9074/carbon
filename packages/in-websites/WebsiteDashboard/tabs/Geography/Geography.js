/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import GlobeViewLoader from 'promise-loader?global,globe-view!in-websites/WebsiteDashboard/components/GlobeView';
import { Route, Switch } from 'react-router-dom';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import getWebsiteCountryBreakdown from 'in-websites/subscriptions/getWebsiteCountryBreakdown';
import FullHeightWrapper from 'in-applications/Dashboards/commonComponents/FullHeightWrapper';
import TwoDWebsiteGeoMap from 'in-websites/WebsiteDashboard/tabs/Geography/2DWebsiteGeoMap';
import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import { websitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import useDisabledBodyScroll from 'in-hooks/useDisabledBodyScroll';
import Button from 'in-new-components/MapControls/Button';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Geography.mless';

const GlobeView = createAsyncViewComponent(GlobeViewLoader);

export default function Geography(props) {
  const { tagFilters, timeConfig } = props;
  useDisabledBodyScroll();

  return (
    <WithEmptyStateFallback
      getHasDataToRender={() => getHasDataToRender(props)}
      title={t('in-websites:websiteDashboard.tabs.geography.geographyTitle')}
      explanation={
        tagFilters && tagFilters.length > 1
          ? t('in-websites:websiteDashboard.tabs.geography.geographyExplanationTagFilters', {
              count: tagFilters.length
            })
          : t('in-websites:websiteDashboard.tabs.geography.geographyExplanation')
      }
    >
      <div className={locals.wrapper}>
        <FullHeightWrapper
          render={height => (
            <Switch>
              <Route
                path={`${websitePathFullyQualified}/geography/globe`}
                render={() => (
                  <div className={locals.globeWrapper}>
                    <GlobeView
                      customHeight={height}
                      tagFilters={tagFilters}
                      timeConfig={timeConfig}
                      getData$={getData$}
                      getValue={v => v.pageLoads}
                    />
                    <Link
                      className={locals.link}
                      href$={getModifiedUrlStream(
                        params => (params.pathname = `${websitePathFullyQualified}/geography`)
                      )}
                    >
                      <SvgIcon className={locals.mapSwitchIconDark} type="lib_website" />
                    </Link>
                    <p className={locals.footerText}>
                      {t('in-websites:websiteDashboard.components.globViewFootertext')}
                    </p>
                  </div>
                )}
              />

              <Route
                path={`${websitePathFullyQualified}/geography`}
                render={() => (
                  <div>
                    <TwoDWebsiteGeoMap
                      tagFilters={tagFilters}
                      timeConfig={timeConfig}
                      height={height}
                      controlWrapperClassName={locals.controlWrapperClassName}
                    />
                    <Tooltip
                      content={t('in-websites:websiteDashboard.tabs.geography.geographyTooltip')}
                      align="leftMiddle"
                    >
                      <Button
                        href$={getModifiedUrlStream(
                          params => (params.pathname = `${websitePathFullyQualified}/geography/globe`)
                        )}
                        className={locals.to3D}
                        renderContent={() => (
                          <span>{t('in-websites:websiteDashboard.tabs.geography.geography3D')}</span>
                        )}
                      />
                    </Tooltip>
                  </div>
                )}
              />
            </Switch>
          )}
        />
      </div>
    </WithEmptyStateFallback>
  );
}

function getData$({ timeConfig, tagFilters }) {
  const tagFiltersInclPageLoadFilter = tagFilters.concat({
    name: 'beacon.type',
    operator: 'EQUALS',
    stringValue: 'pageLoad'
  });

  return getWebsiteCountryBreakdown({
    timeConfig,
    tagFilters: tagFiltersInclPageLoadFilter,
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
