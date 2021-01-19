/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { identity } from 'in-services/util/function';

const cols = [
  {
    title: 'Type',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server.get('type');
      }
    }
  },
  {
    title: 'Bind Address',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.server.getIn(['address', 'address']);
      }
    }
  },
  {
    title: 'Port',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.server.getIn(['address', 'port']);
      },
      // Do not format the port as a number, that is, omit digit group separator.
      getContent: identity
    }
  }
];

export default function HttpServersTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'http'], emptyMap)
    .map((server, name) => {
      return {
        key: name,
        name,
        server,
        snapshotId,
        timeConfig
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  return <Table withoutPadding cardTitle={`HTTP Servers (${rows.length})`} cols={cols} rows={rows} />;
}
