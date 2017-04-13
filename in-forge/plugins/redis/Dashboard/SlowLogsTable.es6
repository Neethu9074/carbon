import React from 'react';

import { muSecondsZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import { formatDateTime } from 'in-services/formatters/date';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      slowLogs: getRawPayload(props.snapshotId, 'slow_logs').map(slowLogs =>
        slowLogs.toArray().sort((a, b) => a.get('timestamp') - b.get('timestamp'))
      )
    };
  },
  function SlowLogsTable({ slowLogs }) {
    if (!slowLogs || slowLogs.size === 0) {
      return null;
    }

    return (
      <DashboardSection title="Slow Logs">
        <ExpandableTable data={slowLogs} getKey={getKey} createHeader={createHeader} createRow={createRow} />
      </DashboardSection>
    );
  }
);

function getKey(slowLog) {
  return slowLog.get('id');
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>id</th>
        <th>time</th>
        <th>duration</th>
        <th>args</th>
      </tr>
    </thead>
  );
}

function createRow(slog) {
  return [
    <td>{slog.get('id')}</td>,
    <td>{formatDateTime(slog.get('timestamp'))}</td>,
    <td>{muSecondsZeroDecimalPlaces(slog.get('duration'))} </td>,
    <td>{slog.get('args').join(' ')}</td>
  ];
}
