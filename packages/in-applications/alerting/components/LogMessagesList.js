import PropTypes from 'prop-types';
import React from 'react';

import { getResolvedTimeConfig, getSparkChartGranularity } from 'in-applications/metrics';
import SparkChart from 'in-components/tables/ServerTable/components/SparkChart';
import getLogMessages from 'in-subscription/application/getLogMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import { number } from 'in-services/formatters/number';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';
import Pill from 'in-new-components/Pill';

import locals from './LogMessagesList.mless';

export default function LogMessagesList({ form, timeConfig, onLogMessageSelect, slideOut }) {
  return (
    <>
      <List
        isSearchable
        getHeader={() => ''}
        searchAttributes={[entity => entity.message]}
        getEntityName={config => config.message}
        columnDefinitions={getColumnDefinitions(timeConfig)}
        loadEntities={() =>
          getTableData({
            applicationId: form.get('applicationId').value,
            tagFilters: form.get('tagFilters').value,
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
      <HelpText>Click on a row to select a Log Message</HelpText>
    </>
  );
}

LogMessagesList.propTypes = {
  form: PropTypes.object.isRequired,
  onLogMessageSelect: PropTypes.func.isRequired,
  slideOut: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function getTableData({
  applicationId,
  tagFilters,
  timeConfig,
  page = 1,
  pageSize = 15,
  orderBy = 'logsAgg',
  orderDirection = 'DESC'
}) {
  return getLogMessages({
    tagFilters,
    timeConfig,
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeConfig,
      application: applicationId
    },
    metrics: {
      logsAgg: {
        metric: 'logs',
        aggregation: 'SUM'
      },
      logs: {
        metric: 'logs',
        aggregation: 'SUM',
        granularity: getSparkChartGranularity(timeConfig)
      }
    }
  });
}

function LogRow(item) {
  return (
    <Tooltip content={item.message} align="topLeft">
      <div className={locals.row}>{item.message}</div>
    </Tooltip>
  );
}

function getColumnDefinitions(timeConfig) {
  return [
    {
      id: 'logMessage',
      label: 'Log Message',
      width: 75,
      getContent: item => LogRow(item),
      noWrap: true,
      ellipsis: '50vw'
    },
    {
      id: 'logLevel',
      label: 'Log Level',
      width: 10,
      getContent(item) {
        return <Pill kind="lighter">{item.level}</Pill>;
      }
    },
    {
      id: 'logsAgg',
      label: 'Count',
      defaultOrderDirection: 'DESC',
      width: 15,
      getContent(item, { result }) {
        return (
          <SparkChart
            rollup={getSparkChartGranularity(timeConfig)}
            timeConfig={getResolvedTimeConfig(timeConfig, result)}
            metrics={item.metrics.logs}
            metric={item.metrics.logsAgg}
            tooltipFormatter={number.compact}
          />
        );
      }
    }
  ];
}
