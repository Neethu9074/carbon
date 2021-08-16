/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import useLogsCursorPagination from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import LogHealthColumn from 'in-logging/analyze/AnalyzeView/components/LogHealthColumn';
import LogTagsTable from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { loadMoreClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { LOG_CUSTOM, LOG_LEVEL } from 'in-logging/queryBuilder';
import { formatDateTime } from 'in-services/formatters/date';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    width: '4.5rem',
    widthInAbsoluteUnit: true,
    getContent({ tags, onSelectTagHref }) {
      return (
        <div className={locals.healthColumn}>
          <LogHealthColumn tags={tags} onSelectTagHref={onSelectTagHref} />
        </div>
      );
    }
  },
  {
    id: 'timestamp',
    width: '10rem',
    useMaxHeight: true,
    widthInAbsoluteUnit: true,
    getContent({ timestamp }) {
      return <div className={locals.dateTime}>{formatDateTime(timestamp)}</div>;
    }
  },
  {
    id: 'log',
    getContent: LogMessageColumn
  },
  {
    id: 'expandIcon',
    width: '2.5rem',
    getContent({ message }) {
      return (
        <CopyToClipboard getText={() => message}>
          {copyToClipboardRef => <IconButton ref={copyToClipboardRef} iconSize="s" type="lib_actions_copy" />}
        </CopyToClipboard>
      );
    }
  }
];

const tracker = {
  loadMoreClicked: () => {
    loadMoreClicked({ view: 'Logs view' });
  }
};

export default function Logs(props) {
  const {
    getHrefWithAdditionalTagFilter,
    getHrefToGroupedView,
    filteringTagCatalog,
    groupingTagCatalog,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter
  } = props;

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

  const tagToLabelMap = useMemo(
    () => new Map((filteringTagCatalog?.tags || []).map(({ name, label }) => [name, label])),
    [filteringTagCatalog]
  );

  const allowedTagsForGrouping = useMemo(() => new Set((groupingTagCatalog?.tags || []).map(({ name }) => name)), [
    groupingTagCatalog
  ]);

  let content = (
    <UngroupedViewList
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      useCursorPaginationStrategy={useLogsCursorPagination}
      classNames={{ listItem: locals.listItem }}
      withoutSorting
      columnDefinitions={columnDefinitions}
      getData={params => getTableData(params)}
      getId={item => item.itemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={detailId => getLog({ itemId: detailId })}
      onSelectTagHref={onSelectTagHref}
      withCountHeader={false}
      tracker={tracker}
      renderNestedContent={(_, item) => (
        <LogTagsTable
          item={item}
          onSelectTagHref={onSelectTagHref}
          getHrefToGroupedView={getHrefToGroupedView}
          tagToLabelMap={tagToLabelMap}
          allowedTagsForGrouping={allowedTagsForGrouping}
        />
      )}
    />
  );

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function DetailView() {
  return null;
}

function getTableData(props) {
  const { timeConfig, afterKey, backendQueryModel, loadAfterCount, retrievalSize } = props;

  return getLogs({
    timeConfig,
    retrievalSize,
    afterKey,
    loadAfterCount,
    tagFilterExpression: backendQueryModel,
    tags: [LOG_CUSTOM, LOG_LEVEL]
  });
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}
