/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.oracleDB.sessionId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.serialNumber'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.serialNumber;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.cpuMins'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpuMins;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.program'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.program;
      },
      getContent(value) {
        return value;
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topTenCPUConsumingSessions')
    };
  },

  function T({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const topTenCPUConsumingSessionsPayload = data.get('raw_payload');
    if (topTenCPUConsumingSessionsPayload.size === 0) {
      return null;
    }

    const rows = topTenCPUConsumingSessionsPayload.toJS().map(session => {
      return {
        key: session.sessionId.toString(),
        cpuMins: session.cpuMins,
        program: session.program,
        serialNumber: session.serialNumber
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topTenCPUConsumingSessions', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={2}
        initialSortDirection="desc"
      />
    );
  }
);
