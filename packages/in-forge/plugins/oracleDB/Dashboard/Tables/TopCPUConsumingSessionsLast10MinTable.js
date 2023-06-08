/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const instCols = [
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
        return row.sessionSerial;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.count'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.count;
      },
      getContent(value) {
        return value;
      }
    }
  }
];

const instIdCol = [
  {
    title: t('in-forge:plugins.oracleDB.instanceID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instId;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'topCPUConsumingSessionsLast10Mints')
    };
  },

  function T(props) {
    const { data, snapshot } = props;
    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    const topTenCPUConsumingSessionsPayload = data.get('raw_payload');
    if (topTenCPUConsumingSessionsPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    var cols = instCols;
    var initialSortColumn = 2;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
      initialSortColumn = 3;
    }

    const rows = topTenCPUConsumingSessionsPayload.toJS().map(session => {
      return {
        key: session.sessionId.toString(),
        count: session.count,
        sessionSerial: session.sessionSerial,
        instId: session.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.topCPUConsumingSessionsLast10Mints', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
        initialSortColumn={initialSortColumn}
        initialSortDirection="desc"
      />
    );
  }
);
