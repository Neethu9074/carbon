/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  JavaScriptError,
  PaginatedResult,
  Result,
  TagFilterExpressionElementUnion,
  TimeConfig,
  WebsiteErrorsItem
} from '@instana/types';
import { CarbonLayer } from '@instana/components';

import { FormModelElement, joinExpressions } from 'in-components/QueryBuilder/transformation/formModel';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/JsErrorsList.mless';

const columnDefinitions = [
  {
    id: 'message',
    label: t('in-alerting:smartAlerts.websites.components.errorMessage'),
    getContent: (error: JavaScriptError) => ErrorRow(error)
  }
];

interface JsErrorsListProps {
  websiteId: string;
  tagFilterExpression: TagFilterExpressionElementUnion;
  timeConfig: TimeConfig;
  onJsErrorSelect: (arg: string) => void;
  slideOut: () => void;
}

export default function JsErrorsList({
  websiteId,
  tagFilterExpression,
  timeConfig,
  onJsErrorSelect,
  slideOut
}: JsErrorsListProps) {
  return (
    <CarbonLayer>
      <List
        key={Math.random()} // It's save to trigger a reload this way because results are memoized in the backend.
        getHeader={() => ''}
        searchAttributes={[entity => entity.message]}
        getEntityName={config => config.message}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilterExpression: toBackendQueryModel(
              joinExpressions({
                logicalOperator: and,
                expressions: [
                  tagFilter('beacon.website.id', 'EQUALS', websiteId),
                  tagFilterExpression as FormModelElement | FormModelElement[]
                ]
              })
            ),
            timeConfig
          })
            .filter(tableData => Boolean(tableData.data))
            .map((tableData: Result<PaginatedResult<WebsiteErrorsItem>>) =>
              (tableData.data as PaginatedResult<WebsiteErrorsItem>)?.items.map((item: WebsiteErrorsItem) => item.error)
            )
        }
        pageSize={10}
        noDataMessage={t('in-alerting:smartAlerts.websites.components.noJSErrorFound')}
        onRowClick={error => {
          onJsErrorSelect(error.message);
          slideOut();
        }}
        isSearchable
      />
    </CarbonLayer>
  );
}

interface TableDataProps {
  timeConfig: TimeConfig;
  tagFilterExpression: TagFilterExpressionElementUnion;
}

function getTableData({ timeConfig, tagFilterExpression }: TableDataProps) {
  return getWebsiteErrors({
    tagFilterExpression,
    timeConfig,
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'errorsAgg',
      direction: 'DESC'
    },
    metrics: {
      errorsAgg: {
        metric: 'errors',
        aggregation: 'SUM'
      }
    }
  });
}

function ErrorRow(error: JavaScriptError) {
  return (
    <Tooltip content={error.message} align="topLeft" delay={500}>
      <div className={locals.row}>{error.message}</div>
    </Tooltip>
  );
}
