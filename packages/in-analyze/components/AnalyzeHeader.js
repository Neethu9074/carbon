import React from 'react';

import {
  getLinkToAnalyze as getLinkToMobileAppAnalyze,
  analyzePath as mobileAppAnalyzePath,
  mobileAppMonitoringPath
} from 'in-mobile-apps/navigation/paths';
import {
  getLinkToAnalyze as getLinkToWebsiteAnalyze,
  analyzePath as websiteAnalyzePath,
  websiteMonitoringPath
} from 'in-websites/navigation/paths';
import {
  SecondLevelNavigation,
  SecondLevelNavigationItem,
  SecondLevelNavigationGroup
} from 'in-new-components/SecondLevelNavigation';
import {
  getLinkToAnalyze as getLinkToProfilesAnalyze,
  analyzePath as profilingAnalyzePath
} from 'in-profiling/navigation/paths';
import { customEventsInWebsiteMonitoringEnabled, mobileAppMonitoringEnabled } from 'in-services/featureFlags';
import getConfigByDataSource, { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import { hasApplicationsAccess, hasWebsitesAccess, hasMobileAppsAccess } from 'in-stores/permission';
import { beaconType as mobileAppBeaconTypeMatrixParameter } from 'in-mobile-apps/navigation/matrix';
import { beaconType as websiteBeaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
import { dataSource as dataSourceTypeMatrixParameter } from 'in-profiling/navigation/matrix';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';
import { defaultGroupings as defaultMobileAppGroupings } from 'in-mobile-apps/tags';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import DashboardHeader, { themes } from 'in-new-components/DashboardHeader';
import { analyze as appAnalyzePath } from 'in-analyze/navigation/paths';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import { isNotBlank } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  dataSource: navigationParameters$.map(getDataSource)
})(AnalyzeHeader);

function AnalyzeHeader({ dataSource, renderQuickFilterBar, isGrouped }) {
  return (
    <>
      <DashboardHeader
        icon={getIconByType(dataSource.dataSource, dataSource.productArea)}
        contextConfigurations={[{ renderContext: () => 'Analytics', contextIcon: 'lib_analyze_inverted' }]}
        label={getLabelByType(dataSource.dataSource, dataSource.productArea)}
        title="Analytics"
      />
      <DashboardHeaderModule withBottomBorder theme={themes.light}>
        <SecondLevelNavigation hasGroups>
          <SecondLevelNavigationGroup
            label="Applications"
            {...secondLevelActive(['calls', 'traces'], 'application', dataSource)}
          >
            {hasApplicationsAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToAnalyze({
                  dataSource: 'calls',
                  groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
                })}
                {...getProps('calls', 'application', dataSource)}
              />
            )}
            {hasApplicationsAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToAnalyze({
                  dataSource: 'traces',
                  groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : emptyObject
                })}
                {...getProps('traces', 'application', dataSource)}
              />
            )}
          </SecondLevelNavigationGroup>
          {hasWebsitesAccess && (
            <SecondLevelNavigationGroup
              label="Websites"
              withSeparator
              {...secondLevelActive(
                ['pageLoad', 'resourceLoad', 'httpRequest', 'error', 'custom'],
                'website',
                dataSource
              )}
            >
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
                  beaconType: 'pageLoad'
                })}
                {...getProps('pageLoad', 'website', dataSource)}
                addGroupSeparator={hasApplicationsAccess}
              />
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
                  beaconType: 'resourceLoad'
                })}
                {...getProps('resourceLoad', 'website', dataSource)}
              />
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
                  beaconType: 'httpRequest'
                })}
                {...getProps('httpRequest', 'website', dataSource)}
              />
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
                  beaconType: 'error'
                })}
                {...getProps('error', 'website', dataSource)}
              />
              {customEventsInWebsiteMonitoringEnabled && (
                <SecondLevelNavigationItem
                  href$={getLinkToWebsiteAnalyze({
                    group: isGrouped ? defaultWebsiteGroupings.custom : emptyObject,
                    beaconType: 'custom'
                  })}
                  {...getProps('custom', 'website', dataSource)}
                />
              )}
            </SecondLevelNavigationGroup>
          )}
          {hasMobileAppsAccess &&
            mobileAppMonitoringEnabled && (
              <SecondLevelNavigationGroup
                label="Mobile Apps"
                withSeparator
                {...secondLevelActive(['sessionStart', 'httpRequest', 'custom'], 'mobileApp', dataSource)}
              >
                <SecondLevelNavigationItem
                  href$={getLinkToMobileAppAnalyze({
                    group: isGrouped ? defaultMobileAppGroupings.sessionStart : emptyObject,
                    beaconType: 'sessionStart'
                  })}
                  {...getProps('sessionStart', 'mobileApp', dataSource)}
                  addGroupSeparator={hasApplicationsAccess || hasWebsitesAccess}
                />
                <SecondLevelNavigationItem
                  href$={getLinkToMobileAppAnalyze({
                    group: isGrouped ? defaultMobileAppGroupings.httpRequest : emptyObject,
                    beaconType: 'httpRequest'
                  })}
                  {...getProps('httpRequest', 'mobileApp', dataSource)}
                />
                {customEventsInWebsiteMonitoringEnabled && (
                  <SecondLevelNavigationItem
                    href$={getLinkToMobileAppAnalyze({
                      group: isGrouped ? defaultMobileAppGroupings.custom : emptyObject,
                      beaconType: 'custom'
                    })}
                    {...getProps('custom', 'mobileApp', dataSource)}
                  />
                )}
              </SecondLevelNavigationGroup>
            )}
          <SecondLevelNavigationGroup
            label="Profiles"
            withSeparator
            {...secondLevelActive(['profiles'], 'profiling', dataSource)}
          >
            <SecondLevelNavigationItem
              href$={getLinkToProfilesAnalyze()}
              {...getProps('profiles', 'profiling', dataSource)}
              addGroupSeparator
            />
          </SecondLevelNavigationGroup>
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      {renderQuickFilterBar && (
        <DashboardHeaderModule withTopBorder={false}>{renderQuickFilterBar()}</DashboardHeaderModule>
      )}
      <DashboardHeaderShadowModule />
    </>
  );
}

function getProps(type, expectedProductArea, { dataSource, productArea }) {
  return {
    icon: getIconByType(type, expectedProductArea),
    label: getLabelByType(type, expectedProductArea),
    isActive: dataSource === type && expectedProductArea === productArea
  };
}

function secondLevelActive(types, expectedProductArea, { dataSource, productArea }) {
  if (expectedProductArea === productArea && types.includes(dataSource)) {
    return { isActive: true };
  }
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
    matrixPath: profilingAnalyzePath,
    matrixParam: dataSourceTypeMatrixParameter,
    productArea: 'profiling'
  },
  {
    pathPrefix: mobileAppMonitoringPath,
    matrixPath: mobileAppAnalyzePath,
    matrixParam: mobileAppBeaconTypeMatrixParameter,
    productArea: 'mobileApp'
  }
];

function getDataSource(location) {
  for (let i = 0; i < dataSourceSources.length; i++) {
    const { matrixPath, matrixParam, productArea, pathPrefix } = dataSourceSources[i];
    if (pathPrefix && !location.pathname.startsWith(pathPrefix)) {
      continue;
    }

    const dataSource = getMatrixParameter(location, matrixPath, matrixParam);
    if (isNotBlank(dataSource)) {
      return {
        productArea,
        dataSource
      };
    }
  }
  return {
    productArea: 'application',
    dataSource: 'calls'
  };
}
