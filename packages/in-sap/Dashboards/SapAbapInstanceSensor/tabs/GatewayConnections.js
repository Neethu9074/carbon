/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

const cols = [
  {
    title: t('in-sap:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('LUNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.tpName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('TPNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.systemType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('SYSTYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.host'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.address'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('ADDR');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.lastReq'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('LAST_REQ');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.no'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('NO');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.tableType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.gatewayMetric.get('TBLTYPE');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'gatewayconnection')
    };
  },
  function GatewayConnections({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const gatewayMetrics = data.get('raw_payload');
    if (gatewayMetrics.size === 0) {
      return null;
    }

    const rows = gatewayMetrics.toArray().map((gatewayMetric, idx) => {
      return {
        key: String(idx),
        gatewayMetric
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.gatewayMetrics')} />}
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
