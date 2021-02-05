/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import getConfigByDataSource, {
  getIconByType,
  getLabelByType,
  productAreaIcons,
  productAreaLabels
} from 'in-analyze/AnalyzeView/dataSources';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { getLinkToAnalyze as getLinkToProfilesAnalyze } from 'in-new-components/Profiling/navigation/paths';
import { loggingEnabled, newAnalyticsEnabled, webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze as getLinkToLogsAnalyze, getLinkToRawLogs } from 'in-logging/navigation/paths';
import { hasApplicationsAccess, hasMobileAppsAccess, hasWebsitesAccess } from 'in-stores/permission';
import { getLinkToAnalyze as getLinkToMobileAppAnalyze } from 'in-mobile-apps/navigation/paths';
import { getLinkToAnalyze as getLinkToWebsiteAnalyze } from 'in-websites/navigation/paths';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { Li, Ul } from 'in-new-components/lists/List';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './AnalyzeDataSourceSelector.mless';

const productAreas = [
  {
    productArea: 'application',
    hasAccess: hasApplicationsAccess || loggingEnabled,
    dataSources: [
      {
        dataSource: 'calls',
        ua2: newAnalyticsEnabled,
        enabled: hasApplicationsAccess,
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'calls',
            groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
          })
      },
      {
        dataSource: 'traces',
        ua2: newAnalyticsEnabled,
        enabled: hasApplicationsAccess,
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'traces',
            groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : emptyObject
          })
      },
      {
        dataSource: 'logs',
        ua2: newAnalyticsEnabled,
        enabled: loggingEnabled,
        getHref$: getLinkToLogsAnalyze
      },
      {
        dataSource: 'rawlogs',
        ua2: newAnalyticsEnabled,
        getHref$: getLinkToRawLogs,
        enabled$: isInternalVisible$.map(isInternalVisible => isInternalVisible && loggingEnabled)
      }
    ]
  },
  {
    productArea: 'website',
    hasAccess: hasWebsitesAccess,
    dataSources: [
      {
        dataSource: 'pageLoad',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
            formModel,
            beaconType: 'pageLoad'
          })
      },
      {
        dataSource: 'pageChange',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.pageChange : emptyObject,
            formModel,
            beaconType: 'pageChange'
          })
      },
      {
        dataSource: 'resourceLoad',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
            formModel,
            beaconType: 'resourceLoad'
          })
      },
      {
        dataSource: 'httpRequest',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
            formModel,
            beaconType: 'httpRequest'
          })
      },
      {
        dataSource: 'error',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
            formModel,
            beaconType: 'error'
          })
      },
      {
        dataSource: 'custom',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped, formModel }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.custom : emptyObject,
            formModel,
            beaconType: 'custom'
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
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.sessionStart : emptyObject,
            beaconType: 'sessionStart'
          })
      },
      {
        dataSource: 'viewChange',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.viewChange : emptyObject,
            beaconType: 'viewChange'
          })
      },
      {
        dataSource: 'httpRequest',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.httpRequest : emptyObject,
            beaconType: 'httpRequest'
          })
      },
      {
        dataSource: 'custom',
        ua2: webMobileQb2AnalyzeEnabled,
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.custom : emptyObject,
            beaconType: 'custom'
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
                productArea={productArea}
                ua2={config.ua2}
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
  close,
  productArea,
  activeConfiguration,
  ua2
}) {
  const isEnabled = useObservable(enabled$, []) ?? !enabled$;
  if (!isEnabled) {
    return null;
  }

  return (
    <Li
      key={dataSource}
      noAlternatingBg
      href$={getHref$({ isGrouped, formModel })}
      onDefaultHrefInteractionSideEffect={close}
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

        {ua2 && (
          <Pill kind="primary" className={locals.betaPill}>
            BETA
          </Pill>
        )}
      </div>
    </Li>
  );
}
