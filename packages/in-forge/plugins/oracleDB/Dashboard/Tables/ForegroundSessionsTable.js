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
        return row.serialNumber;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.audsid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.audsid;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.paddr'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.paddr;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.process'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.process;
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
    title: t('in-forge:plugins.oracleDB.command'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.command;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.ownerId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.ownerId;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.taddr'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.taddr;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.oracleDB.lockWait'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.lockwait;
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
    title: t('in-forge:plugins.oracleDB.server'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server;
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
    title: t('in-forge:plugins.oracleDB.schemaName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.schemaName;
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
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'foregroundSessions'),
      oracleRacMonitoringEnabled: props.snapshot.get('enableRacMonitoring')
    };
  },

  function T(props) {
    const { data, snapshot } = props;

    if (!data || !data.get('raw_payload') || !snapshot || !snapshot.get('data')) {
      return null;
    }
    const foregroundSessionsPayload = data.get('raw_payload');
    if (foregroundSessionsPayload.size === 0) {
      return null;
    }

    const snapshotData = snapshot.get('data');
    const racEnabled = snapshotData.get('enableRacMonitoring');
    var cols = instCols;
    if (racEnabled) {
      cols = instIdCol.concat(cols);
    }

    const rows = foregroundSessionsPayload.toJS().map(foregroundSession => {
      return {
        key: foregroundSession.sid.toString(),
        saddr: foregroundSession.saddr,
        serialNumber: foregroundSession.serialNumber,
        audsid: foregroundSession.audsid,
        paddr: foregroundSession.paddr,
        user: foregroundSession.user,
        userName: foregroundSession.userName,
        command: foregroundSession.command,
        ownerId: foregroundSession.ownerId,
        taddr: foregroundSession.taddr,
        lockwait: foregroundSession.lockwait,
        status: foregroundSession.status,
        server: foregroundSession.server,
        schema: foregroundSession.schema,
        schemaName: foregroundSession.schemaName,
        osUser: foregroundSession.osUser,
        process: foregroundSession.process,
        instId: foregroundSession.instId
      };
    });
    return (
      <Table
        cardTitle={t('in-forge:plugins.oracleDB.foregroundSessions', { len: rows.length })}
        withoutPadding
        cols={cols}
        rows={rows}
        maxItemsPerPage={5}
      />
    );
  }
);
