/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import QueryBuilderWorkspace from 'in-applications/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import PreviewToggle from 'in-applications/analyze/AnalyzeView2_0/components/PreviewToggle';
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getCallGroups from 'in-subscription/application/getCallGroups';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';

const getDataPerDataSource = {
  calls: getCallGroups,
  traces: getTraceGroups
};

export default function GroupedResults(props) {
  const { dataSource, hiddenCalls, previewEnabled, onChangePreviewEnabled } = props;
  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        itemlabelColumnId="name"
        getData={({ timeConfig, backendQueryModel, orderByGroups, groupBy, cursor, metrics }) =>
          getTableData({
            timeConfig,
            backendQueryModel,
            groupBy,
            cursor,
            orderByGroups,
            metrics,
            dataSource: dataSource,
            hiddenCalls: hiddenCalls,
            previewEnabled: previewEnabled
          })
        }
        getLabel={getLabel}
        UngroupedView={Results}
        withSamplingTooltip
        CustomHeaderActions={() => (
          <PreviewToggle previewEnabled={previewEnabled} onChangePreviewEnabled={onChangePreviewEnabled} />
        )}
        additionalGetDataDependencies={[hiddenCalls, previewEnabled]}
      />
    </QueryBuilderWorkspace>
  );
}

function getLabel(item) {
  return item.name;
}

function getTableData({
  timeConfig,
  backendQueryModel,
  groupBy,
  cursor,
  orderByGroups,
  metrics,
  dataSource,
  hiddenCalls,
  previewEnabled
}) {
  const { includeSynthetic = false, includeInternal = false } = hiddenCalls;
  const getData = getDataPerDataSource[dataSource];
  return getData({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    group: groupBy,
    filter: {
      timeConfig
    },
    tagFilterExpression: backendQueryModel,
    order: orderByGroups,
    metrics,
    includeSynthetic,
    includeInternal,
    queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
  });
}
