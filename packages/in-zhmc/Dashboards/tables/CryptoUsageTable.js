/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Table from 'in-sdk/components/dashboard/Table';
import { getRawPayload } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-zhmc:dashboards.channelId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.crypto.get('channelId');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.cryptoId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.crypto.get('cryptoId');
      }
    }
  },
  {
    title: t('in-zhmc:dashboards.adapterUsage'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.crypto.get('adapterUsage');
      }
    }
  }
];

export default connectTo(
  ({ snapshotId }) => {
    return {
      data: getRawPayload(snapshotId, 'cryptos')
    };
  },
  function CryptoUsageTables({ data }) {
    if (!data) {
      return null;
    }
    const cryptos = data.toArray();

    if (cryptos.size === 0) {
      return null;
    }
    const rows = cryptos.map((crypto, idx) => {
      return {
        key: String(idx),
        crypto
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-zhmc:dashboards.cryptoUsage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
