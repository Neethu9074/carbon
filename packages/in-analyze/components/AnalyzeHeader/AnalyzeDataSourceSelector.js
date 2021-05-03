/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { getIconByType, getLabelByType, productAreaIcons, productAreaLabels } from 'in-analyze/AnalyzeView/dataSources';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { getLinkToAnalyze as getLinkToProfilesAnalyze } from 'in-new-components/Profiling/navigation/paths';
import { getLinkToAnalyze as getLinkToLogsAnalyze, getLinkToRawLogs } from 'in-logging/navigation/paths';
import { hasApplicationsAccess, hasMobileAppsAccess, hasWebsitesAccess } from 'in-stores/permission';
import { getLinkToAnalyze as getLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { getLinkToAnalyze as getLinkToMobileAppAnalyze } from 'in-mobile-apps/navigation/paths';
import { getLinkToAnalyze as getLinkToWebsiteAnalyze } from 'in-websites/navigation/paths';
import { defaultGroupings as defaultApplicationGroupings } from 'in-applications/tags';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { default as useMobileTagCatalog } from 'in-mobile-apps/hooks/useTagCatalog';
import { default as useWebsiteTagCatalog } from 'in-websites/hooks/useTagCatalog';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { loggingEnabled } from 'in-services/featureFlags';
import { Li, Ul } from 'in-new-components/lists/List';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

import locals from './AnalyzeDataSourceSelector.mless';

const productAreas = [
  {
    productArea: 'application',
    hasAccess: hasApplicationsAccess || loggingEnabled,
    dataSources: [
      {
        dataSource: 'calls',
        enabled: hasApplicationsAccess,
        getHref$: ({ isGrouped }) =>
          getLinkToApplicationAnalyze({
            dataSource: 'calls',
            groupBy: isGrouped ? defaultApplicationGroupings.calls : emptyObject
          })
      },
      {
        dataSource: 'traces',
        enabled: hasApplicationsAccess,
        getHref$: ({ isGrouped }) =>
          getLinkToApplicationAnalyze({
            dataSource: 'traces',
            groupBy: isGrouped ? defaultApplicationGroupings.traces : emptyObject
          })
      },
      {
        dataSource: 'logs',
        beta: loggingEnabled,
        enabled: loggingEnabled,
        getHref$: getLinkToLogsAnalyze,
        onClickSideEffect: () => jumpToLogs({ source: 'navigation' })
      },
      {
        dataSource: 'rawlogs',
        beta: loggingEnabled,
        getHref$: getLinkToRawLogs,
        enabled$: isInternalVisible$.map(isInternalVisible => isInternalVisible && loggingEnabled),
        onClickSideEffect: () => jumpToLogs({ source: 'navigation' })
      }
    ]
  },
  {
    productArea: 'website',
    hasAccess: hasWebsitesAccess,
    dataSources: [
      {
        dataSource: 'pageLoad',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogPageLoad: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
            formModel,
            beaconType: 'pageLoad',
            tagCatalog
          })
      },
      {
        dataSource: 'pageChange',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogPageChange: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.pageChange : emptyObject,
            formModel,
            beaconType: 'pageChange',
            tagCatalog
          })
      },
      {
        dataSource: 'resourceLoad',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogResourceLoad: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
            formModel,
            beaconType: 'resourceLoad',
            tagCatalog
          })
      },
      {
        dataSource: 'httpRequest',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogHttpRequest: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
            formModel,
            beaconType: 'httpRequest',
            tagCatalog
          })
      },
      {
        dataSource: 'error',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogError: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
            formModel,
            beaconType: 'error',
            tagCatalog
          })
      },
      {
        dataSource: 'custom',
        getHref$: ({ isGrouped, formModel, websiteTagCatalogCustom: tagCatalog }) =>
          tagCatalog &&
          getLinkToWebsiteAnalyze({
            groupBy: isGrouped ? defaultWebsiteGroupings.custom : emptyObject,
            formModel,
            beaconType: 'custom',
            tagCatalog
          })
      }
    ]
  },
  {
    productArea: 'mobileApp',
    hasAccess: hasMobileAppsAccess,
    dataSources: [
      {
        dataSource: 'sessionStart',
        getHref$: ({ isGrouped, formModel, mobileTagCatalogSessionStart: tagCatalog }) =>
          tagCatalog &&
          getLinkToMobileAppAnalyze({
            groupBy: isGrouped ? defaultMobileAppGroupings.sessionStart : emptyObject,
            formModel,
            beaconType: 'sessionStart',
            tagCatalog
          })
      },
      {
        dataSource: 'viewChange',
        getHref$: ({ isGrouped, formModel, mobileTagCatalogViewChange: tagCatalog }) =>
          tagCatalog &&
          getLinkToMobileAppAnalyze({
            groupBy: isGrouped ? defaultMobileAppGroupings.viewChange : emptyObject,
            formModel,
            beaconType: 'viewChange',
            tagCatalog
          })
      },
      {
        dataSource: 'httpRequest',
        getHref$: ({ isGrouped, formModel, mobileTagCatalogHttpRequest: tagCatalog }) =>
          tagCatalog &&
          getLinkToMobileAppAnalyze({
            groupBy: isGrouped ? defaultMobileAppGroupings.httpRequest : emptyObject,
            formModel,
            beaconType: 'httpRequest',
            tagCatalog
          })
      },
      {
        dataSource: 'custom',
        getHref$: ({ isGrouped, formModel, mobileTagCatalogCustom: tagCatalog }) =>
          tagCatalog &&
          getLinkToMobileAppAnalyze({
            groupBy: isGrouped ? defaultMobileAppGroupings.custom : emptyObject,
            formModel,
            beaconType: 'custom',
            tagCatalog
          })
      }
    ]
  },
  {
    productArea: 'profiles',
    hasAccess: true,
    dataSources: [
      {
        dataSource: 'profiles',
        getHref$: getLinkToProfilesAnalyze
      }
    ]
  }
];

export default function AnalyzeDataSourceSelector({ activeConfiguration, isGrouped, formModel = emptyArray, close }) {
  const websiteTagCatalogs = {
    websiteTagCatalogPageLoad: useWebsiteTagCatalog('pageLoad'),
    websiteTagCatalogPageChange: useWebsiteTagCatalog('pageChange'),
    websiteTagCatalogResourceLoad: useWebsiteTagCatalog('resourceLoad'),
    websiteTagCatalogHttpRequest: useWebsiteTagCatalog('httpRequest'),
    websiteTagCatalogError: useWebsiteTagCatalog('error'),
    websiteTagCatalogCustom: useWebsiteTagCatalog('custom')
  };
  const mobileTagCatalogs = {
    mobileTagCatalogSessionStart: useMobileTagCatalog('sessionStart'),
    mobileTagCatalogViewChange: useMobileTagCatalog('viewChange'),
    mobileTagCatalogHttpRequest: useMobileTagCatalog('httpRequest'),
    mobileTagCatalogCustom: useMobileTagCatalog('custom')
  };
  return (
    <Ul className={locals.wrapper}>
      {productAreas
        .filter(({ hasAccess }) => hasAccess)
        .map(({ productArea, dataSources }, i) => {
          const dataSourceListEntries = dataSources
            .filter(({ enabled }) => enabled !== false)
            .map(config => (
              <ProductAreaEntry
                key={config.dataSource}
                {...config}
                close={close}
                isGrouped={isGrouped}
                formModel={formModel}
                websiteTagCatalogs={websiteTagCatalogs}
                mobileTagCatalogs={mobileTagCatalogs}
                productArea={productArea}
                activeConfiguration={activeConfiguration}
              />
            ));

          if (dataSourceListEntries.length === 1) {
            return dataSourceListEntries[0];
          }

          return (
            <Li
              key={productArea}
              initiallyOpen={productArea === activeConfiguration.productArea}
              noAlternatingBg
              toggleContentOnRowClick
              autoFocus={i === 0}
              subList={<Ul>{dataSourceListEntries}</Ul>}
            >
              <div className={locals.iconAndType}>
                <SvgIcon type={productAreaIcons[productArea]} />
                {productAreaLabels[productArea]}
              </div>
            </Li>
          );
        })}
    </Ul>
  );
}

function ProductAreaEntry({
  dataSource,
  getHref$,
  enabled$,
  isGrouped,
  formModel,
  websiteTagCatalogs,
  mobileTagCatalogs,
  close,
  productArea,
  onClickSideEffect,
  activeConfiguration,
  beta
}) {
  const isEnabled = useObservable(enabled$, []) ?? !enabled$;
  if (!isEnabled) {
    return null;
  }

  return (
    <Li
      key={dataSource}
      noAlternatingBg
      href$={getHref$({ isGrouped, formModel, ...websiteTagCatalogs, ...mobileTagCatalogs })}
      onDefaultHrefInteractionSideEffect={() => {
        close();
        if (onClickSideEffect) {
          onClickSideEffect();
        }
      }}
    >
      <div
        className={classNames({
          [locals.iconAndType]: true,
          [locals.active]:
            productArea === activeConfiguration.productArea && dataSource === activeConfiguration.dataSource
        })}
      >
        <SvgIcon type={getIconByType(dataSource, productArea)} />
        {getLabelByType(dataSource)}

        {beta && (
          <Pill kind="primary" className={locals.betaPill}>
            {t('in-analyze:components.analyzeHeader.beta')}
          </Pill>
        )}
      </div>
    </Li>
  );
}
