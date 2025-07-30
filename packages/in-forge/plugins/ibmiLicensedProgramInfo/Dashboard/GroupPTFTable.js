/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.groupPtfStringData.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.level'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.groupPtfStringData.get('level');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.groupPtfStringData.get('status');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.description'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.groupPtfStringData.get('description');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.release'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.groupPtfStringData.get('release');
      }
    }
  }
];

export default connectTo(
  props => {
    const { snapshotId } = props;
    return {
      data: getRawPayloadWithTimestamp(snapshotId, 'groupPtfRawPayload')
    };
  },
  function groupPtfTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const groupPtfRawPayload = data.get('raw_payload');
    if (groupPtfRawPayload.size === 0) {
      return null;
    }

    const rows = groupPtfRawPayload
      .map((groupPtfStringData, key) => {
        return {
          key,
          groupPtfStringData,
          timeConfig,
          snapshotId
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmiLicensedProgramInfo.dashboard.tables.groupPtf.tableName')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
