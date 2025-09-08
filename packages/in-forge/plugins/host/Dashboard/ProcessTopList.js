/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import getProcessSnapshotIdForPid from 'in-subscription/processSnapshotIdForPid';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ProcessTopList.mless';

const baseCols = [
  {
    title: t('in-forge:plugins.host.dashboard.pid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('pid');
      },
      getContent(value) {
        return String(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.processName'),
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
      getFallbackValue(row) {
        return row.process.get('name');
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
    title: t('in-forge:plugins.host.dashboard.cpu'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('cpu');
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.cpuNormalized'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('cpu') / row.host.getIn(['data', 'cpu.count'], 1);
      },
      getContent: percentageZeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.memory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

const aixSpecificCols = [
  {
    title: t('in-forge:plugins.host.dashboard.ppid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('ppid');
      },
      getContent(value) {
        return String(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.gid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('gid');
      },
      getContent(value) {
        return String(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.uid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('uid');
      },
      getContent(value) {
        return String(value);
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.elapsedTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.process.get('elapsedTime');
      },
      getContent(value) {
        return value;
      }
    }
  }
];

export default function ProcessTopList({ snapshot, timeConfig }) {
  const data = useObservable(getRawPayloadWithTimestamp(snapshot.get('id'), 'processes', timeConfig), [snapshot]);

  if (!data || !data.get('raw_payload')) {
    return null;
  }

  const processes = data.get('raw_payload');
  if (processes.size === 0) {
    return null;
  }

  const shouldShowAixColumns = (() => {
    const osName = snapshot.getIn(['data', 'os', 'name']);
    const isAixByOsName = osName && osName.toLowerCase().includes('aix');
    const hasAixFields = processes.some(
      process => process.has('ppid') || process.has('uid') || process.has('gid') || process.has('elapsedTime')
    );
    return isAixByOsName || hasAixFields;
  })();

  let cols;
  if (shouldShowAixColumns) {
    cols = [
      ...baseCols.slice(0, 2), // PID and Process Name
      ...aixSpecificCols, // AIX-specific columns
      ...baseCols.slice(2) // CPU, CPU Normalized, and Memory
    ];
  } else {
    cols = baseCols;
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
      cardTitle={
        <TimeOfLastUpdateCardTitle
          title={t('in-forge:plugins.host.dashboard.processTopList')}
          timestamp={data.get('timestamp')}
        />
      }
      cols={cols}
      rows={rows}
      initialSortColumn={shouldShowAixColumns ? 6 : 2}
      initialSortDirection="desc"
    />
  );
}
