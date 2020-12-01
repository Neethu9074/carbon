import React, { useMemo } from 'react';

import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/QueryBuilderWorkspace';
import GroupedView from 'in-new-components/AnalyzeView/GroupedView';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import IconButton from 'in-new-components/IconButton/IconButton';
import Logs from 'in-logging/analyze/AnalyzeView/Logs';
import Tooltip from 'in-components/Tooltip/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

const columnDefinitions = [
  {
    id: 'icon',
    width: '2rem',
    getContent({ iconMap, groupBy }) {
      return <SvgIcon type={iconMap.get(groupBy?.groupbyTag)} />;
    }
  },
  {
    id: 'label',
    getContent({ group }) {
      return group.label;
    }
  },
  {
    id: 'focus',
    width: '3rem',
    shrink: false,
    getContent({ href }) {
      return (
        <Tooltip content="Focus on this group">
          <IconButton type="lib_actions_filter" href={href} />
        </Tooltip>
      );
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
        itemName="Log"
        columnDefinitions={columnDefinitions}
        getData={({ timeConfig, backendQueryModel, orderBy, groupBy, cursor }) =>
          getTableData({ timeConfig, backendQueryModel, groupbyTag: groupBy.groupbyTag, cursor, orderBy })
        }
        getLabel={item => item.group.label}
        iconMap={iconMap}
        UngroupedView={Logs}
      />
    </QueryBuilderWorkspace>
  );
}

function getTableData({ timeConfig, backendQueryModel, groupbyTag, cursor }) {
  return getLogGroups({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel,
    groupBy: groupbyTag
  });
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
