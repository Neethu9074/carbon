/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import getProcessSnapshotIdForPid from 'in-subscription/processSnapshotIdForPid';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';

import locals from './ProcessTopList.mless';

const cols = [
  {
    title: 'PID',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('pid');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'Process Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getProcessSnapshotIdForPid({
          pid: row.process.get('pid'),
          hostSnapshot: row.host
        });
      },
      withHierarchy: true,
      getFallbackContent(row) {
        const processName = row.process.get('name');
        return (
          <Tooltip content={processName}>
            <span className={locals.label}>{shorten(processName, 100)}</span>
          </Tooltip>
        );
      },
      pathname: '/physical/dashboard',
      useSnapshotFromHierarchyCallback(snapshot, hierarchy) {
        if (hierarchy && hierarchy.length > 0) {
          return hierarchy[0];
        }
        return snapshot;
      }
    }
  },
  {
    title: 'CPU',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('cpu');
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: 'CPU (normalized)',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('cpu') / row.host.getIn(['data', 'cpu.count'], 1);
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'processes', props.timeConfig)
    };
  },
  function ProcessTopList({ snapshot, data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const processes = data.get('raw_payload');
    if (processes.size === 0) {
      return null;
    }

    const rows = processes.toArray().map(process => {
      return {
        key: String(process.get('pid')),
        process,
        host: snapshot
      };
    });

    return (
      <Table
        cardTitle={<TimeOfLastUpdateCardTitle title="Process Top List" timestamp={data.get('timestamp')} />}
        withoutPadding
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
