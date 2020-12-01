import { useLocation } from 'react-router';
import React from 'react';

import {
  getIconByType,
  getLabelByType,
  productAreaLabels,
  productAreaIcons,
  productAreaTrackingNames
} from 'in-analyze/AnalyzeView/dataSources';
import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { analyzePath as mobileAppAnalyzePath, mobileAppMonitoringPath } from 'in-mobile-apps/navigation/paths';
import { dataSource as dataSourceTypeMatrixParameter } from 'in-new-components/Profiling/navigation/matrix';
import { analyzePath as websiteAnalyzePath, websiteMonitoringPath } from 'in-websites/navigation/paths';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import AnalyzeDataSourceSelector from 'in-analyze/components/AnalyzeHeader/AnalyzeDataSourceSelector';
import { beaconType as mobileAppBeaconTypeMatrixParameter } from 'in-mobile-apps/navigation/matrix';
import { analyzePath as profilingAnalyzePath } from 'in-new-components/Profiling/navigation/paths';
import { dataSource as logsDataSourceTypeMatrixParameter } from 'in-logging/navigation/matrix';
import { beaconType as websiteBeaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderButton from 'in-new-components/DashboardHeader/DashboardHeaderButton';
import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { logsPath as logsAnalyzePath } from 'in-logging/navigation/paths';
import { analyze as appAnalyzePath } from 'in-analyze/navigation/paths';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Overlay from 'in-new-components/overlays/Overlay/Overlay';
import { newAnalyticsEnabled } from 'in-services/featureFlags';
import { isNotBlank } from 'in-services/util/string';
import useObservable from 'in-hooks/useObservable';
import Title from 'in-components/Title/Title';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import Link from 'in-components/Link';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({ renderQuickFilterBar, isGrouped }) {
  const location = useLocation();
  const activeConfiguration = getActiveConfiguration(location);

  return (
    <>
      <DashboardHeader
        contextConfigurations={[{ renderContext: () => 'Analytics', contextIcon: 'lib_analyze_inverted' }]}
        renderMetaInformation={() =>
          activeConfiguration?.ua2 && (
            <div className={locals.betaMarker}>
              <Pill kind="primary" className={locals.betaPill}>
                BETA
              </Pill>{' '}
              This feature is in beta.{' '}
              <Link
                className={locals.betaLink}
                external
                href={`https://docs.google.com/forms/d/e/1FAIpQLSejuUF8Gc-wQQN58ffivTnGjYe6OWdqVgLuBo59za3LTTMfIg/viewform?usp=pp_url&entry.558784134=${encodeURIComponent(
                  window.location.href
                )}`}
              >
                You can send us feedback
              </Link>
              .
            </div>
          )
        }
        label={
          <Overlay props={{ activeConfiguration, isGrouped }} withoutWrapper content={AnalyzeDataSourceSelector}>
            {({ toggle, isOpen, ref }) => (
              <DashboardHeaderButton
                size="normal"
                className={locals.button}
                ref={ref}
                onClick={toggle}
                expanded={isOpen}
              >
                <Label activeConfiguration={activeConfiguration} />
              </DashboardHeaderButton>
            )}
          </Overlay>
        }
        title="Analytics"
      />
      <Title title={getLabelByType(activeConfiguration.dataSource)} />
      <ViewTrackingMeta
        data={{
          productArea: productAreaTrackingNames[activeConfiguration.productArea],
          pageRootName: 'Analytics'
        }}
      />
      {renderQuickFilterBar && (
        <DashboardHeaderModule theme={themes.light} withTopBorder>
          {renderQuickFilterBar()}
        </DashboardHeaderModule>
      )}
      <DashboardHeaderShadowModule />
    </>
  );
}

function Label({ activeConfiguration }) {
  const isInternalVisible = useObservable(isInternalVisible$, []);

  if (!activeConfiguration) {
    return null;
  }

  const { productArea, dataSource, ua2 } = activeConfiguration;

  // for normal user UA version is now chosen based on the 'newAnalyticsEnabled' feature flag
  const ua2Enabled = isInternalVisible ? ua2 : newAnalyticsEnabled;
  return (
    <div className={locals.label}>
      {productAreaLabels[productArea] !== getLabelByType(dataSource) && (
        <>
          <SvgIcon className={locals.productAreaIcon} type={productAreaIcons[productArea]} />
          <span className={locals.productAreaLabel}>{productAreaLabels[productArea]}</span>
          <span className={locals.separator}>/</span>
        </>
      )}
      <SvgIcon className={locals.dataSourceIcon} type={getIconByType(dataSource, productArea)} />
      <span className={locals.dataSourceLabel}>{getLabelByType(dataSource, ua2Enabled)}</span>
    </div>
  );
}

const dataSourceSources = [
  {
    matrixPath: appAnalyzePath,
    matrixParam: `callList.${dataSourceMatrixParameter}`,
    productArea: 'application'
  },
  {
    pathPrefix: websiteMonitoringPath,
    matrixPath: websiteAnalyzePath,
    matrixParam: websiteBeaconTypeMatrixParameter,
    productArea: 'website'
  },
  {
    pathPrefix: mobileAppMonitoringPath,
    matrixPath: mobileAppAnalyzePath,
    matrixParam: mobileAppBeaconTypeMatrixParameter,
    productArea: 'mobileApp'
  },
  {
    matrixPath: profilingAnalyzePath,
    matrixParam: dataSourceTypeMatrixParameter,
    productArea: 'profiles'
  },

  {
    matrixPath: logsAnalyzePath,
    matrixParam: logsDataSourceTypeMatrixParameter,
    productArea: 'logs'
  }
];

function getActiveConfiguration(location) {
  for (const { matrixPath, matrixParam, productArea, pathPrefix } of dataSourceSources) {
    if (pathPrefix && !location.pathname.startsWith(pathPrefix)) {
      continue;
    }

    const dataSource = getMatrixParameter(location, matrixPath, matrixParam);
    const ua2 = getMatrixParameter(location, matrixPath, 'ua2') === 'true';

    if (isNotBlank(dataSource)) {
      return {
        productArea,
        dataSource,
        ua2
      };
    }
  }

  return {
    productArea: 'application',
    dataSource: 'calls',
    ua2: false
  };
}
