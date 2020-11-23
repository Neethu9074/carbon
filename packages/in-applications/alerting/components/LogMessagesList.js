import PropTypes from 'prop-types';
import React from 'react';

import getLogMessages from 'in-applications/subscriptions/getLogMessages';
import { propTypeTimeConfig } from 'in-stores/time/config';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';
import Pill from 'in-new-components/Pill';

import locals from './LogMessagesList.mless';

const columnDefinitions = [
  {
    id: 'level',
    label: 'Log Level',
    width: 10,
    getContent(item) {
      return <Pill kind="lighter">{item.level}</Pill>;
    }
  },
  {
    id: 'message',
    label: 'Log Message',
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
      noDataMessage="No alert configured."
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
