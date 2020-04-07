import PropTypes from 'prop-types';
import React from 'react';

import getLogMessages from 'in-subscription/application/getLogMessages';
import HelpText from 'in-components/form/HelpText/HelpText';
import Tooltip from 'in-components/Tooltip/Tooltip';
import List from 'in-settings/components/List';
import Pill from 'in-new-components/Pill';

import locals from './LogMessagesList.mless';

const columnDefinitions = [
  {
    id: 'logLevel',
    label: 'Log Level',
    width: 10,
    getContent(item) {
      return <Pill kind="lighter">{item.level}</Pill>;
    }
  },
  {
    id: 'logMessage',
    label: 'Log Message',
    getContent: item => LogRow(item),
    noWrap: true,
    ellipsis: '50vw'
  }
];

export default function LogMessagesList({ form, timeConfig, onLogMessageSelect, slideOut }) {
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
            applicationId: form.get('applicationId').value,
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

function getTableData({ applicationId, timeConfig }) {
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
      applicationBoundaryScope: 'ALL' // TODO set respective boundary-scope
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
    <Tooltip content={item.message} align="topLeft">
      <div className={locals.row}>{item.message}</div>
    </Tooltip>
  );
}
