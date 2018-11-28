import React from 'react';

import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';
import { analyze as appAnalyzePath } from 'in-analyze/navigation/paths';
import {
  getLinkToAnalyze as getLinkToWebsiteAnalyze,
  analyzePath as websiteAnalyzePath
} from 'in-websites/navigation/paths';
import {
  defaultGroupings as defaultWebsiteGroupings,
  dataSourceTitles as websiteDataSourceTitles
} from 'in-websites/tags';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { beaconType as beaconTypeMatrixParameter } from 'in-websites/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';
import { emptyObject } from 'in-services/fixedObjects';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  dataSource: navigationParameters$
    .map(
      location =>
        getMatrixParameter(location, appAnalyzePath, `callList.${dataSourceMatrixParameter}`) ||
        getMatrixParameter(location, websiteAnalyzePath, beaconTypeMatrixParameter)
    )
    .distinct()
})(AnalyzeHeader);

function AnalyzeHeader({ dataSource, isGrouped }) {
  return (
    <SecondLevelNavigation>
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'traces',
          groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : emptyObject
        })}
        icon="lib_application_trace"
        label="Traces"
        isActive={dataSource === 'traces'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'calls',
          groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : emptyObject
        })}
        icon="lib_application_call"
        label="Calls"
        isActive={dataSource === 'calls'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToWebsiteAnalyze({
          group: isGrouped ? defaultWebsiteGroupings.pageLoad : emptyObject,
          beaconType: 'pageLoad'
        })}
        icon="lib_website"
        label={`${websiteDataSourceTitles.pageLoad}s`}
        isActive={dataSource === 'pageLoad'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToWebsiteAnalyze({
          group: isGrouped ? defaultWebsiteGroupings.resourceLoad : emptyObject,
          beaconType: 'resourceLoad'
        })}
        icon="lib_website"
        label={`${websiteDataSourceTitles.resourceLoad}s`}
        isActive={dataSource === 'resourceLoad'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToWebsiteAnalyze({
          group: isGrouped ? defaultWebsiteGroupings.httpRequest : emptyObject,
          beaconType: 'httpRequest'
        })}
        icon="lib_website"
        label={`${websiteDataSourceTitles.httpRequest}s`}
        isActive={dataSource === 'httpRequest'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToWebsiteAnalyze({
          group: isGrouped ? defaultWebsiteGroupings.error : emptyObject,
          beaconType: 'error'
        })}
        icon="lib_website"
        label={`${websiteDataSourceTitles.error}s`}
        isActive={dataSource === 'error'}
      />
    </SecondLevelNavigation>
  );
}
