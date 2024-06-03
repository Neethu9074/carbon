/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/RawTableFormat.mless';

const cols = [
  {
    title: t('in-sap:dashboards.destinations'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCDEST');
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
        return row.tRfcData.get('ARFCUSER');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.wpPID'),
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
    title: t('in-sap:dashboards.tCode'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCTCODE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.rfcState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCSTATE');
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
        return row.tRfcData.get('ARFCFNAM');
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
        return row.tRfcData.get('ARFCDATUM');
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
        return row.tRfcData.get('ARFCUZEIT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.counter'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCLUWCNT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.message'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.tRfcData.get('ARFCMSG');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];
export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'inboundQRfcInfo')
    };
  },

  function InboundQueueRfcInfo({ data }) {
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
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.inboundQueueRfcInfo')} />}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
