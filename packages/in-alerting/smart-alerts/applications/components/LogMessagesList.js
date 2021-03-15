/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import getLogMessages from 'in-applications/subscriptions/getLogMessages';
import { propTypeTimeConfig } from 'in-stores/time/config';
import List from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/LogMessagesList.mless';

const columnDefinitions = [
  {
    id: 'level',
    label: t('in-alerting:smartAlerts.applications.logMessages.levelColumn'),
    width: 10,
    getContent(item) {
      return <Pill kind="lighter">{item.level}</Pill>;
    }
  },
  {
    id: 'message',
    label: t('in-alerting:smartAlerts.applications.logMessages.messageColumn'),
    getContent: item => LogRow(item),
    noWrap: true,
    ellipsis: '50vw'
  }
];

export default function LogMessagesList({
  applicationId,
  applicationBoundaryScope,
  timeConfig,
  onLogMessageSelect,
  slideOut
}) {
  return (
    <List
      isSearchable
      getHeader={() => ''}
      searchAttributes={[entity => entity.message]}
      getEntityName={config => config.message}
      columnDefinitions={columnDefinitions}
      loadEntities={() =>
        getTableData({
          applicationId,
          applicationBoundaryScope,
          timeConfig
        })
          .filter(tableData => tableData.data)
          .map(tableData => tableData.data.items)
      }
      pageSize={10}
      noDataMessage={t('in-alerting:smartAlerts.applications.logMessages.noDataMessage')}
      onRowClick={log => {
        onLogMessageSelect(log.message, log.level);
        slideOut();
      }}
    />
  );
}

LogMessagesList.propTypes = {
  applicationId: PropTypes.string.isRequired,
  applicationBoundaryScope: PropTypes.string.isRequired,
  onLogMessageSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: propTypeTimeConfig.isRequired
};

function getTableData({ applicationId, applicationBoundaryScope, timeConfig }) {
  return getLogMessages({
    pagination: {
      page: 1,
      pageSize: 200
    },
    order: {
      by: 'logsAgg',
      direction: 'DESC'
    },
    filter: {
      label: '',
      timeConfig,
      application: applicationId,
      applicationBoundaryScope
    },
    metrics: {
      logsAgg: {
        metric: 'logs',
        aggregation: 'SUM'
      }
    }
  });
}

function LogRow(item) {
  return (
    <Tooltip content={item.message} align="topLeft" delay={500}>
      <div className={locals.row}>{item.message}</div>
    </Tooltip>
  );
}
