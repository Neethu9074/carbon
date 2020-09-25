import { just } from 'reactive-observables';
import React from 'react';

import getConfigByDataSource, {
  getIconByType,
  getLabelByType,
  productAreaLabels,
  productAreaIcons
} from 'in-analyze/AnalyzeView/dataSources';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { getLinkToAnalyze as getLinkToProfilesAnalyze } from 'in-new-components/Profiling/navigation/paths';
import { hasApplicationsAccess, hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { getLinkToAnalyze as getLinkToMobileAppAnalyze } from 'in-mobile-apps/navigation/paths';
import { getLinkToAnalyze as getLinkToWebsiteAnalyze } from 'in-websites/navigation/paths';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { newAnalyticsEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import evaluateClassNames from 'in-services/util/classnames';
import { emptyObject } from 'in-services/fixedObjects';
import { Ul, Li } from 'in-new-components/lists/List';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AnalyzeDataSourceSelector.mless';

const productAreas = [
  {
    productArea: 'application',
    hasAccess: hasApplicationsAccess,
    dataSources: [
      {
        dataSource: 'calls',
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'calls',
            groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
          })
      },
      {
        // The data source will eventually be removed
        dataSource: 'callsUQB',
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'callsUQB',
            groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
          }),
        enabled$: newAnalyticsEnabled ? just(true) : isInternalVisible$
      },
      {
        dataSource: 'traces',
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'traces',
            groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : emptyObject
          })
      }
    ]
  },
  {
    productArea: 'website',
    hasAccess: hasWebsitesAccess,
    dataSources: [
      {
        dataSource: 'pageLoad',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
            beaconType: 'pageLoad'
          })
      },
      {
        dataSource: 'pageChange',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.pageChange : emptyObject,
            beaconType: 'pageChange'
          })
      },
      {
        dataSource: 'resourceLoad',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
            beaconType: 'resourceLoad'
          })
      },
      {
        dataSource: 'httpRequest',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
            beaconType: 'httpRequest'
          })
      },
      {
        dataSource: 'error',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
            beaconType: 'error'
          })
      },
      {
        dataSource: 'custom',
        getHref$: ({ isGrouped }) =>
          getLinkToWebsiteAnalyze({
            group: isGrouped ? defaultWebsiteGroupings.custom : emptyObject,
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
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.sessionStart : emptyObject,
            beaconType: 'sessionStart'
          })
      },
      {
        dataSource: 'viewChange',
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.viewChange : emptyObject,
            beaconType: 'viewChange'
          })
      },
      {
        dataSource: 'httpRequest',
        getHref$: ({ isGrouped }) =>
          getLinkToMobileAppAnalyze({
            group: isGrouped ? defaultMobileAppGroupings.httpRequest : emptyObject,
            beaconType: 'httpRequest'
          })
      },
      {
        dataSource: 'custom',
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
        getHref$: () => getLinkToProfilesAnalyze()
      }
    ]
  }
];

export default function AnalyzeDataSourceSelector({ activeConfiguration, isGrouped, close }) {
  const getHref$Opts = {
    isGrouped
  };

  return (
    <Ul className={locals.wrapper}>
      {productAreas
        .filter(({ hasAccess }) => hasAccess)
        .map(({ productArea, dataSources }, i) => {
          const dataSourceListEntries = dataSources
            .filter(({ enabled$ }) => !enabled$ || useObservable(enabled$, []))
            .map(({ dataSource, getHref$ }) => (
              <Li
                key={dataSource}
                noAlternatingBg
                href$={getHref$(getHref$Opts)}
                onDefaultHrefInteractionSideEffect={close}
              >
                <div
                  className={evaluateClassNames({
                    [locals.iconAndType]: true,
                    [locals.active]:
                      productArea === activeConfiguration.productArea && dataSource === activeConfiguration.dataSource
                  })}
                >
                  <SvgIcon type={getIconByType(dataSource, productArea)} />
                  {getLabelByType(dataSource, productArea)}
                </div>
              </Li>
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
