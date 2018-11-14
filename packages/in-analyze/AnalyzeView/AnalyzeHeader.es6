import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';

export default function AnalyzeHeader({ dataSource, filters }) {
  const isGrouped = !!filters.getIn(['group', 'name']);
  return (
    <SecondLevelNavigation>
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'traces',
          groupByTag: isGrouped ? getConfigByDataSource('traces').defaultGrouping : {}
        })}
        icon="lib_application_trace"
        label="Traces"
        isActive={dataSource === 'traces'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'calls',
          groupByTag: isGrouped ? getConfigByDataSource('calls').defaultGrouping : {}
        })}
        icon="lib_application_call"
        label="Calls"
        isActive={dataSource === 'calls'}
      />
    </SecondLevelNavigation>
  );
}
