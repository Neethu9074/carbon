/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface FileRow {
  key: string;
  snapshotId: string;
  fileInfo: Map<string, any>;
}

interface FileAttributesProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.fileName'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('file_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.lastAccessedTime'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('last_accessed');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.lastChangedTime'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('last_changed');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.access'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('access');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.type'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('type');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.size'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('size');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.contentChanged'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('content_changed');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.owner'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('owner') || '';
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.group'),
    type: 'string',
    typeArgs: {
      getValue(row: FileRow) {
        return row.fileInfo.get('group') || '';
      }
    }
  }
];

const FileAttributes = function FileAttributes({ snapshotId, timeConfig }: FileAttributesProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'files'), [snapshotId]);

  if (!data) {
    return null;
  }

  const files = (data as SnapshotData).get('raw_payload');
  const rows: FileRow[] = files
    .keySeq()
    .toArray()
    .map((key: string) => {
      const fileInfo = files.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        fileInfo
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return <Table cardTitle={t('in-forge:plugins.host.dashboard.files')} withoutPadding cols={cols} rows={rows} />;
};

export default FileAttributes;
