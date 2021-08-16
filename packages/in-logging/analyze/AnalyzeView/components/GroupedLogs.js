/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { KeyValue } from '@instana/components';

import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import GroupedView, { GROUP_COLORS } from 'in-components/AnalyzeView/GroupedView';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import Logs from 'in-logging/analyze/AnalyzeView/components/Logs';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { percentage } from 'in-services/formatters/number';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import theme from 'in-themes';
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
  const { Sidebar = FacetedSearchPresenter, filteringTagCatalog, groupBy } = props;

  const iconMap = useMemo(() => createIconMap(filteringTagCatalog), [filteringTagCatalog]);
  const getColor = (item, index) => getLogGroupColor(item, index, groupBy);

  return (
    <QueryBuilderWorkspace {...props} getColor={getColor}>
      <GroupedView
        {...props}
        Sidebar={Sidebar}
        columnDefinitions={columnDefinitions}
        itemlabelColumnId="label"
        getColor={getColor}
        getData={getTableData}
        iconMap={iconMap}
        UngroupedView={Logs}
        CustomHeaderActions={TagSelector}
        withoutSorting
        tracker={tracker}
      />
    </QueryBuilderWorkspace>
  );
}
function getLogGroupColor(item, index, groupBy) {
  if (groupBy?.groupbyTag === LOG_LEVEL) {
    const logLevel = item.label.toLowerCase();
    if (logLevel === 'error') {
      return theme.lib.colors.failure;
    }
    if (logLevel === 'warn') {
      return theme.lib.colors.warning;
    }
    if (logLevel === 'info') {
      return theme.lib.colors.lightBlue800;
    }
  }
  return GROUP_COLORS[index];
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
