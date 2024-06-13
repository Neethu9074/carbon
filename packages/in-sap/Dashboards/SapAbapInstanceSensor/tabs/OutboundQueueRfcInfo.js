/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('MANDT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QRFCUSER');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.destinations'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('DEST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.procId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCPID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.rfcQueueName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.functionModule'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QRFCFNAM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.queueState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QSTATE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.date'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QRFCDATUM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.time'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('QRFCUZEIT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.message'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ERRMESS');
      },
      getContent(args) {
        return <Args args={shorten(args, 64)} />;
      }
    }
  }
];
export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'outboundQRfcInfo')
    };
  },

  function OutboundQueueRfcInfo({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const tRfcData = data.get('raw_payload');
    if (tRfcData.size === 0) {
      return null;
    }
    const rows = tRfcData.toArray().map((tRfcData, idx) => {
      return {
        key: String(idx),
        tRfcData
      };
    });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-sap:dashboards.outboundQueueRfcInfo')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code>{args}</code>;
}
