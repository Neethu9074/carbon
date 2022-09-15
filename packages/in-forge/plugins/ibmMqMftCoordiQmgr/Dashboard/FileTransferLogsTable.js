/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import FileTransferItemsTable from 'in-forge/plugins/ibmMqMftCoordiQmgr/Dashboard/FileTransferItemsTable';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.sourceAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferLogsData.' + row.key + '.sourceAgent');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.destinationAgent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferLogsData.' + row.key + '.destinationAgent');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.startedTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferLogsData.' + row.key + '.startedTime');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.originatorUserID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return (
          row.data.get('fileTransferLogsData.' + row.key + '.originatorUserID') +
          '@' +
          row.data.get('fileTransferLogsData.' + row.key + '.originatorHostName')
        );
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmMqMftFileTransferLog.dashboard.actionStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.data.get('fileTransferLogsData.' + row.key + '.actionStatus');
      }
    }
  }
];

export default function FileTransferLogsTable({ snapshot, timeConfig }) {
  const fileTransferLogs = snapshot.getIn(['data', 'fileTransferLogs'], emptyList);
  if (fileTransferLogs.size === 0) {
    return null;
  }

  const rows = fileTransferLogs.toArray().map(fileTransferLog => {
    return {
      key: fileTransferLog,
      snapshotId: snapshot.get('id'),
      timeConfig,
      data: snapshot.get('data')
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.ibmMqMftAgent.dashboard.fileTransferLogsWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      maxItemsPerPage={8}
      initialSortDirection="desc"
      initialSortColumn={2}
    />
  );
}

function getRowDetails(row) {
  const timeConfig = row.timeConfig;
  const items = row.data.get('fileTransferLogsData.' + row.key + '.fileTransferItems');
  if (items != undefined) {
    return <FileTransferItemsTable snapshot={items} timeConfig={timeConfig} />;
  }
}
