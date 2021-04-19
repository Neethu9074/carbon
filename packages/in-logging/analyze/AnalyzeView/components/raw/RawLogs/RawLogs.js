/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import emptyTagFilterExpression from 'in-new-components/QueryBuilder/tagFilter/emptyTagFilterExpression';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/raw/QueryBuilderWorkspace';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter/DangerousHtmlPresenter';
import { getUniqueErrors } from 'in-new-components/Errors/ErroneousResultPresenter';
import UngroupedViewList from 'in-new-components/AnalyzeView/UngroupedViewList';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import { formatDateTime } from 'in-services/formatters/date';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';

import locals from './RawLogs.mless';

const columnDefinitions = [
  {
    id: 'timestamp',
    width: '7.75rem',
    getContent({ timestamp }) {
      return <span className={locals.time}>{formatDateTime(timestamp)}</span>;
    }
  },
  {
    id: 'log',
    getContent({ message }) {
      return <DangerousHtmlPresenter className={locals.message} html={message} />;
    }
  }
];

export default function RawLogs(props) {
  let content = (
    <UngroupedViewList
      {...props}
      useCursorPaginationStrategy={useLogsCursorPagination}
      classNames={{ listItem: locals.listItem }}
      withoutSorting
      columnDefinitions={columnDefinitions}
      getData={getTableData}
      getId={item => item.itemId}
      withoutListItemLinkToDetails
      getDetailData={detailId => getLog({ id: detailId })}
      DetailView={DetailView}
      withCountHeader={false}
      Presenter={Presenter}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function Presenter(props) {
  const { result } = props;
  const items = getItems(/*props.items*/);

  return (
    <div className={locals.wrapper}>
      <Ul className={locals.list} framed={false} space="disabled">
        load more top
        {result?.errors && <ErrorListItems errors={result.errors} />}
        {items.map(item => (
          <Li key={item.itemId} className={locals.listItem} size="compact">
            <ColumnizedContent {...item} {...props} columnDefinitions={columnDefinitions} />
          </Li>
        ))}
        load more bottom
      </Ul>
    </div>
  );
}

function DetailView() {
  return null;
}

function ErrorListItems({ errors }) {
  errors = getUniqueErrors(errors);
  return (
    <>
      {errors.map(error => (
        <Li key={error} className={locals.errorListItem} size="compact">
          {error}
        </Li>
      ))}
    </>
  );
}

function getTableData({ timeConfig, afterKey, backendQueryModel, loadAfterCount }) {
  return getLogs({
    timeConfig,
    retrievalSize: 20,
    afterKey,
    loadAfterCount,
    logicalOperator: 'AND',
    logTagFilterExpression: backendQueryModel,
    infraTagFilterExpression: emptyTagFilterExpression
  });
}

function getItems() {
  const now = Date.now();
  return [
    { itemId: -1, timestamp: now, message: 'This feature is about to come, so:' },
    { itemId: 1, timestamp: now, message: '╔═══╗╔╗────────╔════╗─────────╔╗' },
    { itemId: 2, timestamp: now, message: '║╔═╗╠╝╚╗───────║╔╗╔╗║─────────║║' },
    { itemId: 3, timestamp: now, message: '║╚══╬╗╔╬══╦╗─╔╗╚╝║║╠╣╔╦═╗╔══╦═╝║' },
    { itemId: 4, timestamp: now, message: '╚══╗║║║║╔╗║║─║║──║║║║║║╔╗╣║═╣╔╗║' },
    { itemId: 5, timestamp: now, message: '║╚═╝║║╚╣╔╗║╚═╝║──║║║╚╝║║║║║═╣╚╝║' },
    { itemId: 6, timestamp: now, message: '╚═══╝╚═╩╝╚╩═╗╔╝──╚╝╚══╩╝╚╩══╩══╝' },
    { itemId: 7, timestamp: now, message: '──────────╔═╝║' },
    { itemId: 8, timestamp: now, message: '──────────╚══╝' }
  ];
}
