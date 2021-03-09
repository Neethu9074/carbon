/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import getWebsiteErrors from 'in-websites/subscriptions/getWebsiteErrors';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/JsErrorsList.mless';

const columnDefinitions = [
  {
    id: 'message',
    label: t('in-websites:alerting.components.errorMessage'),
    getContent: error => ErrorRow(error)
  }
];

export default function JsErrorsList({ websiteId, tagFilters, timeConfig, onJsErrorSelect, slideOut }) {
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
            tagFilters: [
              ...tagFilters,
              {
                name: 'beacon.website.id',
                operator: 'EQUALS',
                stringValue: websiteId
              }
            ],
            timeConfig
          })
            .filter(tableData => tableData.data)
            .map(tableData => tableData.data.items.map(item => item.error))
        }
        pageSize={10}
        noDataMessage={t('in-websites:alerting.components.noDataMessage')}
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
  tagFilters: PropTypes.arrayOf(PropTypes.object).isRequired,
  onJsErrorSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getTableData({ timeConfig, tagFilters }) {
  return getWebsiteErrors({
    tagFilters,
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
