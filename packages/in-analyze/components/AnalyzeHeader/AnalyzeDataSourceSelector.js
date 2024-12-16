/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import { Li, SvgIcon, Ul, PreviewPill } from '@instana/components';
import { useObservable } from '@instana/hooks';

/* eslint-enable no-restricted-imports */
import { getIconByType, getLabelByType, productAreaIcons, productAreaLabels } from 'in-analyze/AnalyzeView/dataSources';
/* eslint-disable no-restricted-imports */
import { getTagCatalog as getTracesTagCatalog } from 'in-applications/analyze/components/workspace/TraceQueryBuilder';
import {
  hasAnalyzeAccess,
  hasApplicationsAccess,
  hasInfrastructureAccess,
  hasMobileAppsAccess,
  hasWebsitesAccess
} from 'in-stores/permission';
import {
  defaultInfraExploreViewParams,
  useLinkToExplore as useLinkToInfraEntityExplore
} from 'in-infrastructure/navigation/paths';
import { getTagCatalog as getCallsTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';
import { infraExploreDataEnabled, loggingEnabled, mobileAppCrashBeaconEnabled } from 'in-services/featureFlags';
import { useLinkToAnalyze as useLinkToProfileAnalyze } from 'in-components/Profiling/navigation/paths';
import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { default as useApplicationTagCatalog } from 'in-applications/hooks/useTagCatalog';
import { defaultGroupings as defaultApplicationGroupings } from 'in-applications/tags';
import { default as useMobileTagCatalog } from 'in-mobile-apps/hooks/useTagCatalog';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { default as useWebsiteTagCatalog } from 'in-websites/hooks/useTagCatalog';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useGenerateLinkToAnalyze } from 'in-websites/navigation/paths';
import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import { useGenerateLinkToLogs } from 'in-logging/navigation/paths';
import { useLinkToAnalyze } from 'in-mobile-apps/navigation/paths';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import unwrapLink from 'in-stores/navigation/unwrapLink';
import { role } from 'in-stores/user';

import locals from './AnalyzeDataSourceSelector.mless';

export default function AnalyzeDataSourceSelector({ activeConfiguration, isGrouped, formModel = emptyArray, close }) {
  const getLinkToMobileAppAnalyze = useLinkToAnalyze();
  const getLinkToInfraEntityExplore = useLinkToInfraEntityExplore();
  const { trackJumpToLogs } = useAnalyzeTracker();
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
    mobileTagCatalogCustom: useMobileTagCatalog('custom'),
    mobileTagCatalogCrash: useMobileTagCatalog('crash')
  };
  const callsTagCatalog = useApplicationTagCatalog(getCallsTagCatalog);
  const tracesTagCatalog = useApplicationTagCatalog(getTracesTagCatalog);

  const getAnalyzeHref = useGenerateLinkToAnalyze();
  const getLinkToApplicationAnalyze = useLinkToApplicationAnalyze();
  const generateLogsHref = useGenerateLinkToLogs();

  const linkToProfileAnalyze = useLinkToProfileAnalyze();
  const productAreas = [
    {
      productArea: 'logs',
      hasAccess: loggingEnabled && role.canViewLogs,
      dataSources: [
        {
          dataSource: 'logs',
          getHref: generateLogsHref,
          onClickSideEffect: () => trackJumpToLogs({ source: 'navigation' })
        }
      ]
    },
    {
      productArea: 'application',
      hasAccess: hasApplicationsAccess,
      dataSources: [
        {
          dataSource: 'calls',
          enabled: hasApplicationsAccess,
          getHref: ({ isGrouped, formModel, callsTagCatalog: tagCatalog }) =>
            tagCatalog &&
            getLinkToApplicationAnalyze({
              dataSource: 'calls',
              formModel,
              tagCatalog,
              groupBy: isGrouped ? defaultApplicationGroupings.calls : emptyObject
            })
        },
        {
          dataSource: 'traces',
          enabled: hasApplicationsAccess,
          getHref: ({ isGrouped, formModel, tracesTagCatalog: tagCatalog, setOnClickNotificationMessage }) =>
            tagCatalog &&
            getLinkToApplicationAnalyze({
              dataSource: 'traces',
              formModel,
              tagCatalog,
              groupBy: isGrouped ? defaultApplicationGroupings.traces : emptyObject,
              setOnClickNotificationMessage
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
          getHref: ({ isGrouped, formModel, websiteTagCatalogPageLoad: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
              groupBy: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
              formModel,
              beaconType: 'pageLoad',
              tagCatalog
            })
        },
        {
          dataSource: 'pageChange',
          getHref: ({ isGrouped, formModel, websiteTagCatalogPageChange: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
              groupBy: isGrouped ? defaultWebsiteGroupings.pageChange : emptyObject,
              formModel,
              beaconType: 'pageChange',
              tagCatalog
            })
        },
        {
          dataSource: 'resourceLoad',
          getHref: ({ isGrouped, formModel, websiteTagCatalogResourceLoad: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
              groupBy: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
              formModel,
              beaconType: 'resourceLoad',
              tagCatalog
            })
        },
        {
          dataSource: 'httpRequest',
          getHref: ({ isGrouped, formModel, websiteTagCatalogHttpRequest: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
              groupBy: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
              formModel,
              beaconType: 'httpRequest',
              tagCatalog
            })
        },
        {
          dataSource: 'error',
          getHref: ({ isGrouped, formModel, websiteTagCatalogError: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
              groupBy: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
              formModel,
              beaconType: 'error',
              tagCatalog
            })
        },
        {
          dataSource: 'custom',
          getHref: ({ isGrouped, formModel, websiteTagCatalogCustom: tagCatalog }) =>
            tagCatalog &&
            getAnalyzeHref({
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
          getHref: ({ isGrouped, formModel, mobileTagCatalogSessionStart: tagCatalog }) =>
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
          getHref: ({ isGrouped, formModel, mobileTagCatalogViewChange: tagCatalog }) =>
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
          getHref: ({ isGrouped, formModel, mobileTagCatalogHttpRequest: tagCatalog }) =>
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
          getHref: ({ isGrouped, formModel, mobileTagCatalogCustom: tagCatalog }) =>
            tagCatalog &&
            getLinkToMobileAppAnalyze({
              groupBy: isGrouped ? defaultMobileAppGroupings.custom : emptyObject,
              formModel,
              beaconType: 'custom',
              tagCatalog
            })
        },
        {
          dataSource: 'crash',
          enabled: mobileAppCrashBeaconEnabled,
          getHref: ({ isGrouped, formModel, mobileTagCatalogCrash: tagCatalog }) =>
            tagCatalog &&
            getLinkToMobileAppAnalyze({
              groupBy: isGrouped ? defaultMobileAppGroupings.crash : emptyObject,
              formModel,
              beaconType: 'crash',
              tagCatalog
            })
        }
      ]
    },
    {
      productArea: 'infrastructure',
      hasAccess: infraExploreDataEnabled && hasInfrastructureAccess,
      dataSources: [
        {
          dataSource: 'infrastructure',
          getHref: () => getLinkToInfraEntityExplore(defaultInfraExploreViewParams)
        }
      ]
    },
    {
      productArea: 'profiles',
      hasAccess: hasAnalyzeAccess,
      dataSources: [
        {
          dataSource: 'profiles',
          getHref: () => {
            return linkToProfileAnalyze;
          }
        }
      ]
    }
  ];

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
                callsTagCatalog={callsTagCatalog}
                tracesTagCatalog={tracesTagCatalog}
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
  getHref,
  enabled$,
  isGrouped,
  formModel,
  websiteTagCatalogs,
  mobileTagCatalogs,
  callsTagCatalog,
  tracesTagCatalog,
  close,
  productArea,
  onClickSideEffect,
  activeConfiguration,
  beta
}) {
  const { trackAnalyzeViewSelected } = useAnalyzeTracker();
  const [onClickNotificationMessage, setOnClickNotificationMessage] = useState();
  const isEnabled = useObservable(enabled$, []) ?? !enabled$;

  const hrefGetter = getHref$ || getHref;

  const { href$, href } = useMemo(
    () =>
      unwrapLink(
        hrefGetter?.({
          isGrouped,
          formModel,
          ...websiteTagCatalogs,
          ...mobileTagCatalogs,
          callsTagCatalog,
          tracesTagCatalog,
          setOnClickNotificationMessage
        })
      ),
    [callsTagCatalog, formModel, hrefGetter, isGrouped, mobileTagCatalogs, tracesTagCatalog, websiteTagCatalogs]
  );

  if (!isEnabled) {
    return null;
  }

  return (
    <Li
      key={dataSource}
      noAlternatingBg
      href$={href$}
      href={href}
      onDefaultHrefInteractionSideEffect={() => {
        close();
        if (onClickNotificationMessage) {
          addMessage({
            content: onClickNotificationMessage,
            timeout: 5000
          });
        }
        trackAnalyzeViewSelected({ target: dataSource });

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
        {beta && <PreviewPill />}
      </div>
    </Li>
  );
}
