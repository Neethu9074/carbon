/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import IndeterminateLoadingIndicator from 'in-new-components/LoadingIndicators/IndeterminateLoadingIndicator';
import QueryBuilderWorkspace from 'in-logging/analyze/AnalyzeView/components/QueryBuilderWorkspace';
import LogContentColumn from 'in-logging/analyze/AnalyzeView/components/LogContentColumn';
import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import DateTimeSeparated from 'in-components/tables/sharedComponents/DateTimeSeparated';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TagSelector from 'in-logging/analyze/AnalyzeView/components/TagSelector';
import UngroupedViewList from 'in-new-components/AnalyzeView/UngroupedViewList';
import { TAG } from 'in-new-components/QueryBuilder/transformation/formModel';
import { EQUALS } from 'in-new-components/QueryBuilder/tagFilter/operators';
import LogDetail from 'in-logging/analyze/AnalyzeView/LogDetail/LogDetail';
import TagList from 'in-logging/analyze/AnalyzeView/components/TagList';
import { hasError, isLoading } from 'in-services/util/result';
import { pendingResult } from 'in-services/fixedObjects';
import getLogs from 'in-logging/subscriptions/getLogs';
import { number } from 'in-services/formatters/number';
import getLog from 'in-logging/subscriptions/getLog';
import useObservable from 'in-hooks/useObservable';
import { t } from 'in-i18n';

import locals from './Logs.mless';

const columnDefinitions = [
  {
    id: 'timestamp',
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
    sortable: false,
    getContent({ log, groupLabel, getHrefToDetailId, selectedTags, getHrefWithAdditionalTagFilter }) {
      return (
        <LogContentColumn
          content={log.content}
          href={getHrefToDetailId(log.id, groupLabel)}
          onSelectTagHref={tag => getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))}
          tags={log.tags.filter(({ tag }) => selectedTags.indexOf(tag.name) >= 0)}
        />
      );
    }
  }
];

export default function Logs(props) {
  let content = (
    <UngroupedViewList
      {...props}
      classNames={{ listItem: locals.listItem }}
      getItemName={({ count }) =>
        t('in-logging:log', {
          count,
          formattedCount: number.compact(count)
        })
      }
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
      CustomHeaderActions={TagSelector}
      renderNestedContent={logId => (
        <LogDetails
          logId={logId}
          onSelectTagHref={tag => props.getHrefWithAdditionalTagFilter(getTagExpressionWithTag(tag))}
        />
      )}
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

function LogDetails({ logId, onSelectTagHref }) {
  const logResult = useObservable(getLog({ id: logId }), [logId]) ?? pendingResult;
  if (isLoading(logResult)) {
    return (
      <div className={locals.loadingWrapper}>
        <IndeterminateLoadingIndicator />
      </div>
    );
  }
  if (hasError(logResult)) {
    return <ErroneousResultPresenter errors={logResult.errors} />;
  }

  return (
    <HorizontalFlexWrapper className={locals.tagsWrapper}>
      <TagList tags={logResult.data.tags} onSelectTagHref={onSelectTagHref} />
    </HorizontalFlexWrapper>
  );
}

function getTagExpressionWithTag(tag) {
  return {
    ...tag,
    type: TAG,
    operator: EQUALS
  };
}
