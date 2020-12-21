import React from 'react';

import getConfigByDataSource, {
  getIconByType,
  getLabelByType,
  productAreaLabels,
  productAreaIcons
} from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze as getLinkToProfilesAnalyze } from 'in-new-components/Profiling/navigation/paths';
import { hasApplicationsAccess, hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { getLinkToAnalyze as getLinkToMobileAppAnalyze } from 'in-mobile-apps/navigation/paths';
import { getLinkToAnalyze as getLinkToWebsiteAnalyze } from 'in-websites/navigation/paths';
import { getLinkToAnalyze as getLinkToLogsAnalyze } from 'in-logging/navigation/paths';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { loggingEnabled, newAnalyticsEnabled } from 'in-services/featureFlags';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import classNames from 'classnames';
import { emptyObject } from 'in-services/fixedObjects';
import { Ul, Li } from 'in-new-components/lists/List';
import useObservable from 'in-hooks/useObservable';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';

import locals from './AnalyzeDataSourceSelector.mless';

const productAreas = [
  {
    productArea: 'application',
    hasAccess: hasApplicationsAccess,
    dataSources: [
      {
        dataSource: 'calls',
        ua2: newAnalyticsEnabled,
        getHref$: ({ isGrouped }) =>
          getLinkToAnalyze({
            dataSource: 'calls',
            groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
          })
      },
      {
        dataSource: 'traces',
        ua2: newAnalyticsEnabled,
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
        getHref$: getLinkToProfilesAnalyze
      }
    ]
  },
  {
    productArea: 'logs',
    hasAccess: loggingEnabled,
    dataSources: [
      {
        dataSource: 'logs',
        getHref$: () => getLinkToLogsAnalyze()
      }
    ]
  }
];

export default function AnalyzeDataSourceSelector({ activeConfiguration, isGrouped, close }) {
  return (
    <Ul className={locals.wrapper}>
      {productAreas
        .filter(({ hasAccess }) => hasAccess)
        .map(({ productArea, dataSources }, i) => {
          const dataSourceListEntries = dataSources.map(config => (
            <ProductAreaEntry
              key={config.dataSource}
              {...config}
              close={close}
              isGrouped={isGrouped}
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

function ProductAreaEntry({ dataSource, getHref$, enabled$, isGrouped, close, productArea, activeConfiguration, ua2 }) {
  const isEnabled = useObservable(enabled$, []) ?? !enabled$;
  if (!isEnabled) {
    return null;
  }

  return (
    <Li key={dataSource} noAlternatingBg href$={getHref$({ isGrouped })} onDefaultHrefInteractionSideEffect={close}>
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
