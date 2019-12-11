import React from 'react';

import {
  SecondLevelNavigation,
  SecondLevelNavigationItem,
  SecondLevelNavigationGroup
} from 'in-new-components/SecondLevelNavigation';
import {
  getLinkToAnalyze as getLinkToWebsiteAnalyze,
  analyzePath as websiteAnalyzePath
} from 'in-websites/navigation/paths';
import {
  getLinkToAnalyze as getLinkToProfilesAnalyze,
  analyzePath as profilingAnalyzePath
} from 'in-profiling/navigation/paths';
import getConfigByDataSource, { getIconByType, getLabelByType } from 'in-analyze/AnalyzeView/dataSources';
import { customEventsInWebsiteMonitoringEnabled, profilingEnabled } from 'in-services/featureFlags';
import { dataSource as dataSourceTypeMatrixParameter } from 'in-profiling/navigation/matrix';
import DashboardHeaderModule from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { beaconType as beaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';
import { hasApplicationsAccess, hasWebsitesAccess } from 'in-stores/permission';
import { defaultGroupings as defaultWebsiteGroupings } from 'in-websites/tags';
import { defaultGrouping as defaultProfilesGrouping } from 'in-profiling/tags';
import { analyze as appAnalyzePath } from 'in-analyze/navigation/paths';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import DashboardHeader from 'in-new-components/DashboardHeader';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  dataSource: navigationParameters$
    .map(
      location =>
        getMatrixParameter(location, appAnalyzePath, `callList.${dataSourceMatrixParameter}`) ||
        getMatrixParameter(location, websiteAnalyzePath, beaconTypeMatrixParameter) ||
        getMatrixParameter(location, profilingAnalyzePath, dataSourceTypeMatrixParameter)
    )
    .distinct()
})(AnalyzeHeader);

function AnalyzeHeader({ dataSource, renderQuickFilterBar, isGrouped }) {
  return (
    <>
      <DashboardHeader
        icon={getIconByType(dataSource)}
        contextIcon="lib_analyze_inverted"
        renderContext={() => 'Analytics'}
        label={getLabelByType(dataSource)}
        title="Analytics"
      />
      <DashboardHeaderModule withBottomBorder>
        <SecondLevelNavigation hasGroups>
          <SecondLevelNavigationGroup label="Applications" {...secondLevelActive(['calls', 'traces'], dataSource)}>
            {hasApplicationsAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToAnalyze({
                  dataSource: 'calls',
                  groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
                })}
                {...getProps('calls', dataSource)}
              />
            )}
            {hasApplicationsAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToAnalyze({
                  dataSource: 'traces',
                  groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : emptyObject
                })}
                {...getProps('traces', dataSource)}
              />
            )}
          </SecondLevelNavigationGroup>
          <SecondLevelNavigationGroup
            label="Websites"
            withSeparator
            {...secondLevelActive(['pageLoad', 'resourceLoad', 'httpRequest', 'error', 'custom'], dataSource)}
          >
            {hasWebsitesAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
                  beaconType: 'pageLoad'
                })}
                {...getProps('pageLoad', dataSource)}
                addGroupSeparator={hasApplicationsAccess}
              />
            )}
            {hasWebsitesAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
                  beaconType: 'resourceLoad'
                })}
                {...getProps('resourceLoad', dataSource)}
              />
            )}
            {hasWebsitesAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
                  beaconType: 'httpRequest'
                })}
                {...getProps('httpRequest', dataSource)}
              />
            )}
            {hasWebsitesAccess && (
              <SecondLevelNavigationItem
                href$={getLinkToWebsiteAnalyze({
                  group: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
                  beaconType: 'error'
                })}
                {...getProps('error', dataSource)}
              />
            )}
            {customEventsInWebsiteMonitoringEnabled &&
              hasWebsitesAccess && (
                <SecondLevelNavigationItem
                  href$={getLinkToWebsiteAnalyze({
                    group: isGrouped ? defaultWebsiteGroupings.custom : emptyObject,
                    beaconType: 'custom'
                  })}
                  {...getProps('custom', dataSource)}
                />
              )}
          </SecondLevelNavigationGroup>
          <SecondLevelNavigationGroup label="Profiles" withSeparator {...secondLevelActive(['profiles'], dataSource)}>
            {profilingEnabled && (
              <SecondLevelNavigationItem
                href$={getLinkToProfilesAnalyze({
                  group: defaultProfilesGrouping
                })}
                {...getProps('profiles', dataSource)}
                addGroupSeparator
              />
            )}
          </SecondLevelNavigationGroup>
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      {renderQuickFilterBar && (
        <DashboardHeaderModule dropShadow withTopBorder={false}>
          {renderQuickFilterBar()}
        </DashboardHeaderModule>
      )}
    </>
  );
}

function getProps(type, dataSource) {
  return {
    icon: getIconByType(type),
    label: getLabelByType(type),
    isActive: dataSource === type
  };
}

function secondLevelActive(types, dataSource) {
  if (types.includes(dataSource)) {
    return { isActive: true };
  }
}
