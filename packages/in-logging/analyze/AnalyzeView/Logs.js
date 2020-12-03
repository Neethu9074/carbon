import React from 'react';

import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/QueryBuilderWorkspace';
import DateTimeSeparated from 'in-components/tables/sharedComponents/DateTimeSeparated';
import LogContentColumn from 'in-logging/analyze/AnalyzeView/LogContentColumn';
import LogDetail from 'in-logging/analyze/AnalyzeView/LogDetail/LogDetail';
import UngroupedView from 'in-new-components/AnalyzeView/UngroupedView';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'timestamp',
    label: 'Time',
    width: '8rem',
    useMaxHeight: true,
    widthInAbsoluteUnit: true,
    getContent({ log }) {
      return (
        <div className={locals.dateTime}>
          <DateTimeSeparated>{log.timestamp}</DateTimeSeparated>
        </div>
      );
    }
  },
  {
    id: 'log',
    label: 'Log',
    sortable: false,
    getContent({ log, groupLabel, getHrefToDetailId }) {
      return (
        <LogContentColumn content={log.strippedContent} tags={log.tags} href={getHrefToDetailId(log.id, groupLabel)} />
      );
    }
  }
];

export default function Logs(props) {
  let content = (
    <UngroupedView
      {...props}
      classNames={{
        listItem: locals.listItem
      }}
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
      withoutListItemLinkToDetails
      DetailView={LogDetail}
      getDetailData={detailId => getLog({ id: detailId })}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
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
