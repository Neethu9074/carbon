import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getDefaultGrouping } from 'in-analyze/defaultGroupings';
import { getLinkToAnalyze } from 'in-analyze/navigation/paths';

export default function AnalyzeHeader({ dataSource, filters }) {
  const isGrouped = !!filters.getIn(['group', 'name']);
  return (
    <SecondLevelNavigation>
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'traces',
          groupByTag: isGrouped ? getDefaultGrouping(true) : {}
        })}
        icon="lib_application_trace"
        label="Traces"
        isActive={dataSource === 'traces'}
      />
      <SecondLevelNavigationItem
        href$={getLinkToAnalyze({
          dataSource: 'calls',
          groupByTag: isGrouped ? getDefaultGrouping(false) : {}
        })}
        icon="lib_application_call"
        label="Calls"
        isActive={dataSource === 'calls'}
      />
    </SecondLevelNavigation>
  );
}
