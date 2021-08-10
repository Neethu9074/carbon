/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { KeyValue } from '@instana/components';

import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import GroupedView from 'in-components/AnalyzeView/GroupedView';
import { percentage } from 'in-services/formatters/number';
import { ChartsPresenter } from './ChartsPresenter';
import { t } from 'in-i18n';

const tracker = {
  loadMoreClicked: () => {
    loadMoreClicked({ view: 'Grouped logs view' });
  }
};

const columnDefinitions = [
  {
    id: 'numberOfLogsPercentage',
    width: '7rem',
    widthInAbsoluteUnit: true,
    getContent({ item }) {
      return (
        <KeyValue
          label={t('in-logging:numberOfLogsPercentage')}
          value={percentage.detailed(item.percentage)}
          accentuated
        />
      );
    }
  },
  {
    id: 'numberOfLogs',
    width: '8rem',
    widthInAbsoluteUnit: true,
    getContent({ item }) {
      return <KeyValue label={t('in-logging:numberOfLogs')} value={item.numberOfLogs} accentuated />;
    }
  }
];

export default function GroupedLogs(props) {
  const { filteringTagCatalog } = props;

  const iconMap = useMemo(() => createIconMap(filteringTagCatalog), [filteringTagCatalog]);

  return (
    <QueryBuilderWorkspace {...props}>
      <GroupedView
        {...props}
        Sidebar={FacetedSearchPresenter}
        Chart={ChartsPresenter}
        columnDefinitions={columnDefinitions}
        itemlabelColumnId="label"
        getData={getTableData}
        iconMap={iconMap}
        UngroupedView={Logs}
        CustomHeaderActions={TagSelector}
        withoutSorting
        getItemLabel={({ label }) => label}
        tracker={tracker}
      />
    </QueryBuilderWorkspace>
  );
}

function createIconMap(tagCatalog) {
  const icons = new Map();
  const tagTree = tagCatalog?.tagTree;
  if (!tagTree) {
    return icons;
  }
  for (const child of tagTree[0].children) {
    addToMap(child, icons);
  }
  return icons;
}

function addToMap({ tagName, icon, children }, map) {
  map.set(tagName, icon);
  if (children) {
    for (const child of children) {
      addToMap(child, map);
    }
  }
}

function getTableData({ timeConfig, cursor, backendQueryModel, groupBy }) {
  return getLogGroups({
    timeConfig,
    group: groupBy,
    tagFilterExpression: backendQueryModel,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}
