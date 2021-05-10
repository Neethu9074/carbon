/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/JsErrorsList.mless';

const columnDefinitions = [
  {
    id: 'message',
    label: t('in-alerting:smartAlerts.websites.components.errorMessage'),
    getContent: error => ErrorRow(error)
  }
];

export default function JsErrorsList({ websiteId, tagFilterExpression, timeConfig, onJsErrorSelect, slideOut }) {
  return (
    <>
      <List
        isSearchable
        getHeader={() => ''}
        searchAttributes={[entity => entity.message]}
        getEntityName={config => config.message}
        columnDefinitions={columnDefinitions}
        loadEntities={() =>
          getTableData({
            tagFilterExpression: toBackendQueryModel(
              joinExpressions({
                logicalOperator: and,
                expressions: [tagFilter('beacon.website.id', 'EQUALS', websiteId), tagFilterExpression]
              })
            ),
            timeConfig
          })
            .filter(tableData => tableData.data)
            .map(tableData => tableData.data.items.map(item => item.error))
        }
        pageSize={10}
        noDataMessage={t('in-alerting:smartAlerts.websites.components.noDataMessage')}
        onRowClick={error => {
          onJsErrorSelect(error.message);
          slideOut();
        }}
      />
    </>
  );
}

JsErrorsList.propTypes = {
  websiteId: PropTypes.string.isRequired,
  tagFilterExpression: PropTypes.arrayOf(PropTypes.object).isRequired,
  onJsErrorSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getTableData({ timeConfig, tagFilterExpression }) {
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

function ErrorRow(error) {
  return (
    <Tooltip content={error.message} align="topLeft" delay={500}>
      <div className={locals.row}>{error.message}</div>
    </Tooltip>
  );
}
