/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useRef } from 'react';

import { Button } from '@instana/components';

import {
  logLevelColumn,
  timestampColumn,
  centerAlignedCopyColumn,
  centerAlignedLinkColumn
} from 'in-logging/analyze/AnalyzeView/utils/logsColumnUtils';
import {
  LOG_CUSTOM,
  LOG_EXCEPTION_MESSAGE,
  LOG_EXCEPTION_STACK_TRACE,
  LOG_EXCEPTION_TYPE,
  LOG_LEVEL
} from 'in-logging/queryBuilder';
import { createPageSizeAwareLogsCursorPaginationHook } from 'in-logging/analyze/AnalyzeView/components/hooks/useLogsCursorPagination';
import { FacetedSearchPresenter } from 'in-logging/analyze/AnalyzeView/components/FacetedSearchPresenter';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import { ChartsPresenter } from 'in-logging/analyze/AnalyzeView/components/ChartsPresenter';
import LogMessageColumn from 'in-logging/analyze/AnalyzeView/components/LogMessageColumn';
import { LogTagsTable } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import UngroupedViewList from 'in-components/AnalyzeView/UngroupedViewList';
import { TAG } from 'in-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import getLogs from 'in-logging/subscriptions/getLogs';
import getLog from 'in-logging/subscriptions/getLog';
import { ScrollIntoView } from './ScrollIntoView';
import { t } from 'in-i18n';

import locals from './Logs.mless';

const columnDefinitions = [
  logLevelColumn,
  timestampColumn,
  {
    id: 'log',
    getContent: LogMessageColumn
  },
  centerAlignedLinkColumn,
  centerAlignedCopyColumn
];

export default function Logs(props) {
  const {
    getHrefWithAdditionalTagFilter,
    getHrefToGroupedView,
    Sidebar = FacetedSearchPresenter,
    Chart = ChartsPresenter,
    initialLogLines
  } = props;

  const onSelectTagHref = getHrefWithAdditionalTagFilter
    ? tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))
    : undefined;

  const selectedWasOpened = useRef(false);

  const initiallyToggled = props.selectedId !== undefined ? [props.selectedId] : [];
  const toggledEntries = useRef(new Set(initiallyToggled));

  function onToggleHandler(toggled, item) {
    const itemId = getItemId(item);
    if (toggled) {
      toggledEntries.current.add(itemId);
    } else {
      toggledEntries.current.delete(itemId);
    }
  }

  let content = (
    <UngroupedViewList
      {...props}
      Sidebar={Sidebar}
      Chart={Chart}
      useCursorPaginationStrategy={createPageSizeAwareLogsCursorPaginationHook(initialLogLines)}
      classNames={{ listItem: locals.listItem }}
      columnDefinitions={columnDefinitions}
      getData={params => getTableData(params)}
      getId={getItemId}
      withoutListItemLinkToDetails
      DetailView={DetailView}
      getDetailData={detailId => getLog({ itemId: detailId })}
      onSelectTagHref={onSelectTagHref}
      withCountHeader={false}
      withoutHeader={false}
      CustomHeaderActions={CustomHeaderActions}
      initiallyOpenedItemIds={[...toggledEntries.current]}
      onToggleContentRow={onToggleHandler}
      renderNestedContent={(_, item) =>
        scrollIntoViewIfSelected(
          ref => (
            <LogTagsTable
              ref={ref}
              item={item}
              onSelectTagHref={onSelectTagHref}
              getHrefToGroupedView={getHrefToGroupedView}
            />
          ),
          item.itemId === props.selectedId
        )
      }
    />
  );

  function scrollIntoViewIfSelected(renderElement, selected) {
    if (selected && !selectedWasOpened.current) {
      selectedWasOpened.current = true;
      return <ScrollIntoView renderChildren={ref => renderElement(ref)} />;
    }
    return renderElement(null);
  }

  if (!props.withoutHeader && !props.detailId) {
    content = <QueryBuilderWorkspace {...props}>{content}</QueryBuilderWorkspace>;
  }

  return content;
}

function DetailView() {
  return null;
}

function CustomHeaderActions({ orderBy, setOrder }) {
  return (
    <Button
      icon={orderBy.direction === 'ASC' ? 'lib_actions_sort_ascending' : 'lib_actions_sort_descending'}
      kind="secondary"
      onClick={() =>
        setOrder({
          by: orderBy.by,
          direction: orderBy.direction === 'ASC' ? 'DESC' : 'ASC'
        })
      }
    >
      {orderBy.direction === 'ASC' ? t('in-logging:sorting.oldest') : t('in-logging:sorting.mostRecent')}
    </Button>
  );
}

function getTableData(props) {
  const { timeConfig, afterKey, backendQueryModel, retrievalSize, orderBy } = props;

  return getLogs({
    timeConfig,
    retrievalSize,
    afterKey,
    tagFilterExpression: backendQueryModel,
    tags: [LOG_CUSTOM, LOG_LEVEL, LOG_EXCEPTION_TYPE, LOG_EXCEPTION_MESSAGE, LOG_EXCEPTION_STACK_TRACE],
    orderDirection: orderBy?.direction
  });
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}

function getItemId(item) {
  return item.itemId;
}
