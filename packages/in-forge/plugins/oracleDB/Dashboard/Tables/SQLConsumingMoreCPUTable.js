/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// import { megaBytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const instCols = [
  {
    title: t('in-forge:plugins.oracleDB.sqlId'),
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
    title: t('in-forge:plugins.oracleDB.ospid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.ospid;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.sid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.sid;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.serial'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.serial;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userName;
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
  },
  {
    title: t('in-forge:plugins.oracleDB.module'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.module;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.osUser'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.osUser;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.machine'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.machine;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.status;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.cpuUsageInSeconds'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpuUsageInSeconds;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'sqlIdConsumingMoreCPU')
    };
  },

  function T(props) {
    const { data, snapshot } = props;
    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    const TopTenSQLWithHighIOLast1HrPayload = data.get('raw_payload');
    if (TopTenSQLWithHighIOLast1HrPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    var cols = instCols;
    var initialSortColumn = 10;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
      initialSortColumn = 11;
    }

    const rows = TopTenSQLWithHighIOLast1HrPayload.toJS().map(sql => {
      return {
        key: sql.sqlId,
        ospid: sql.ospid,
        sid: sql.sid,
        serial: sql.serial,
        userName: sql.userName,
        program: sql.program,
        module: sql.module,
        osUser: sql.osUser,
        machine: sql.machine,
        status: sql.status,
        cpuUsageInSeconds: sql.cpuUsageInSeconds,
        instId: sql.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.sqlIdConsumingmoreCPU', { len: rows.length })}
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
