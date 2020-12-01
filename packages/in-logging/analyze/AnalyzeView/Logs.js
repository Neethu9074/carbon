import React from 'react';

import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/QueryBuilderWorkspace';
import DateTimeSeparated from 'in-components/tables/sharedComponents/DateTimeSeparated';
import LogContentColumn from 'in-logging/analyze/AnalyzeView/LogContentColumn';
import UngroupedView from 'in-new-components/AnalyzeView/UngroupedView';
import getLogs from 'in-logging/subscriptions/getLogs';

const columnDefinitions = [
  {
    id: 'timestamp',
    label: 'Time',
    width: '6rem',
    widthInAbsoluteUnit: true,
    getContent({ log }) {
      return <DateTimeSeparated>{log.timestamp}</DateTimeSeparated>;
    }
  },
  {
    id: 'log',
    label: 'Log',
    sortable: false,
    getContent({ log }) {
      return <LogContentColumn content={log.strippedContent} tags={log.tags} />;
    }
  }
];

export default function Logs(props) {
  let content = (
    <UngroupedView
      {...props}
      itemName="Log"
      sortOptions={[
        {
          value: 'timestamp',
          label: 'Time'
        }
      ]}
      columnDefinitions={columnDefinitions}
      getData={({ timeConfig, backendQueryModel, orderBy, cursor }) =>
        getTableData({ timeConfig, backendQueryModel, orderBy, cursor })
      }
      getId={item => item.log.id}
    />
  );

  if (!props.withoutHeader) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function getTableData({ timeConfig, backendQueryModel, orderBy, cursor }) {
  return getLogs({
    pagination: {
      cursor,
      retrievalSize: 20
    },
    order: orderBy,
    timeConfig: timeConfig,
    tagFilterExpression: backendQueryModel
  });
}
