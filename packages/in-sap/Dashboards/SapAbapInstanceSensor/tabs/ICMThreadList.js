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
    title: t('in-sap:dashboards.threadState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('THR_STAT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.reqType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('REQ_TYPE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.reqCount'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('REQ_COUNT');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.conn'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('CONN');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.guid'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('GUID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.threadID'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.icmDetail.get('THR_ID');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'icmthread')
    };
  },
  function ICMThreadList({ data }) {
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
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.icmThreadMetrics')} />}
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
