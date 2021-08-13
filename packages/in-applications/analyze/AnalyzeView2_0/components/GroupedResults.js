/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useCallback } from 'react';

import { FacetedSearchPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-applications/analyze/AnalyzeView2_0/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-applications/analyze/AnalyzeView2_0/components/ChartsPresenter';
import PreviewToggle from 'in-applications/analyze/AnalyzeView2_0/components/PreviewToggle';
import Results from 'in-applications/analyze/AnalyzeView2_0/components/Results';
import getTraceGroups from 'in-subscription/application/getTraceGroups';
import getCallGroups from 'in-subscription/application/getCallGroups';
import GroupedView from 'in-components/AnalyzeView/GroupedView';

const getDataPerDataSource = {
  calls: getCallGroups,
  traces: getTraceGroups
};

export default function GroupedResults(props) {
  const {
    hiddenCalls,
    previewEnabled,
    onChangePreviewEnabled,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter
  } = props;

  const getData = useCallback(params => getTableData({ ...params, hiddenCalls, previewEnabled }), [
    hiddenCalls,
    previewEnabled
  ]);
  return (
    <QueryBuilderWorkspace
      {...props}
      CustomAction={() => (
        <PreviewToggle previewEnabled={previewEnabled} onChangePreviewEnabled={onChangePreviewEnabled} />
      )}
    >
      <GroupedView
        {...props}
        Sidebar={Sidebar}
        Chart={Chart}
        itemlabelColumnId="name"
        getData={getData}
        getLabel={getLabel}
        UngroupedView={Results}
        withSamplingTooltip
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
