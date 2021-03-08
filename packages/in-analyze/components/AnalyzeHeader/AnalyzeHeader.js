/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { useLocation } from 'react-router';
import React from 'react';

import {
  getIconByType,
  getLabelByType,
  productAreaLabels,
  productAreaIcons,
  productAreaTrackingNames
} from 'in-analyze/AnalyzeView/dataSources';
import { logsPath as logsAnalyzePath, rawLogsPath as rawLogsPathAnalyzePath } from 'in-logging/navigation/paths';
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
import { newAnalyticsEnabled, webMobileQb2AnalyzeEnabled } from 'in-services/featureFlags';
import { dataSource as dataSourceMatrixParameterUA1 } from 'in-analyze/navigation/matrix';
import FeatureFeedback from 'in-new-components/FeatureFeedback/FeatureFeedback';
import { dataSourceMatrixParameter } from 'in-applications/navigation/matrix';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { analyze as appAnalyzePath } from 'in-analyze/navigation/paths';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import Overlay from 'in-new-components/overlays/Overlay/Overlay';
import FeatureNew from 'in-new-components/FeatureNew/FeatureNew';
import { emptyArray } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';
import Title from 'in-components/Title/Title';
import SvgIcon from 'in-components/SvgIcon';
import { t } from 'in-i18n';

import locals from './AnalyzeHeader.mless';

export default function AnalyzeHeader({ renderQuickFilterBar, isGrouped, formModel = emptyArray, withoutShadow }) {
  const location = useLocation();
  const activeConfiguration = getActiveConfiguration(location);

  return (
    <>
      <DashboardHeader
        contextConfigurations={[{ renderContext: () => 'Analytics', contextIcon: 'lib_analyze_inverted' }]}
        renderMetaInformation={() => {
          if (activeConfiguration?.beta) {
            return (
              <FeatureFeedback
                href={`https://docs.google.com/forms/d/e/1FAIpQLSejuUF8Gc-wQQN58ffivTnGjYe6OWdqVgLuBo59za3LTTMfIg/viewform?usp=pp_url&entry.558784134=${encodeURIComponent(
                  window.location.href
                )}`}
              />
            );
          }
          if (activeConfiguration?.ua2) {
            return (
              <FeatureNew
                text={t('in-analyze:analyzeHeader.learnNewUI')}
                href="https://www.youtube.com/watch?v=0vDC1qI4Eew"
              />
            );
          }
          return null;
        }}
        label={
          <Overlay
            props={{ activeConfiguration, isGrouped, formModel }}
            withoutWrapper
            content={AnalyzeDataSourceSelector}
          >
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
        title={t('in-analyze:analyzeHeader.title')}
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
      {!withoutShadow && <DashboardHeaderShadowModule />}
    </>
  );
}

function Label({ activeConfiguration }) {
  if (!activeConfiguration) {
    return null;
  }

  const { productArea, dataSource } = activeConfiguration;
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
      <span className={locals.dataSourceLabel}>{getLabelByType(dataSource)}</span>
    </div>
  );
}

const dataSourceSources = [
  newAnalyticsEnabled
    ? {
        matrixPath: dataSourceMatrixParameter.path,
        matrixParam: dataSourceMatrixParameter.name,
        productArea: 'application'
      }
    : {
        matrixPath: appAnalyzePath,
        matrixParam: `callList.${dataSourceMatrixParameterUA1}`,
        productArea: 'application'
      },
  {
    matrixPath: logsAnalyzePath,
    matrixParam: logsDataSourceTypeMatrixParameter,
    productArea: 'application'
  },
  {
    matrixPath: rawLogsPathAnalyzePath,
    matrixParam: logsDataSourceTypeMatrixParameter,
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
  }
];

function getActiveConfiguration(location) {
  for (const { matrixPath, matrixParam, productArea, pathPrefix } of dataSourceSources) {
    if (pathPrefix && !location.pathname.startsWith(pathPrefix)) {
      continue;
    }

    const ua2EnabledProductAreas = {
      website: webMobileQb2AnalyzeEnabled,
      application: newAnalyticsEnabled,
      mobileApp: webMobileQb2AnalyzeEnabled
    };

    const dataSource = getMatrixParameter(location, matrixPath, matrixParam);
    const ua2 = ua2EnabledProductAreas[productArea];
    if (isNotBlank(dataSource)) {
      return {
        productArea,
        dataSource,
        ua2,
        beta: dataSource === 'logs' || dataSource === 'rawlogs'
      };
    }
  }

  return {
    productArea: 'application',
    dataSource: 'calls',
    ua2: newAnalyticsEnabled
  };
}
