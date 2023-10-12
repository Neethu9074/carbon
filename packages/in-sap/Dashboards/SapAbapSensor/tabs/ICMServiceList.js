/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-sap:dashboards.active'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('ACTIVE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.service'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('SERVICE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.hostName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('HOSTNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.extBind'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('EXTBIND');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.protocol'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('PROTOCOL');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.keepAlive'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('KEEPALIVE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.procTimeOut'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('PROC_TIMEOUT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.vcClient'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('VCLIENT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.virtualhostIdx'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('VIRT_HOST_IDX');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'icmservice')
    };
  },
  function ICMServiceList({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const icmDetails = data.get('raw_payload');
    if (icmDetails.size === 0) {
      return null;
    }

    const rows = icmDetails.toArray().map((icmDetail, idx) => {
      return {
        key: String(idx),
        icmDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.icmCurrentService')} />}
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="asc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
