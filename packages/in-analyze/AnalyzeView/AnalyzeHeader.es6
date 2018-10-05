import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { dataSource as dataSourceMatrixParameter } from 'in-analyze/navigation/matrix';

export default function AnalyzeHeader({ dataSource, onChangeDataSource }) {
  return (
    <SecondLevelNavigation>
      <SecondLevelNavigationItem
        href=""
        onClick={e => {
          e.preventDefault();
          onChangeDataSource({
            [dataSourceMatrixParameter]: 'traces'
          });
        }}
        icon="lib_application_trace"
        label="Traces"
        isActive={dataSource === 'traces'}
      />
      <SecondLevelNavigationItem
        href=""
        onClick={e => {
          e.preventDefault();
          onChangeDataSource({
            [dataSourceMatrixParameter]: 'calls'
          });
        }}
        icon="lib_application_call"
        label="Calls"
        isActive={dataSource === 'calls'}
      />
    </SecondLevelNavigation>
  );
}
