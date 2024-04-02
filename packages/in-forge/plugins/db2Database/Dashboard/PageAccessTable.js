/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
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
    title: t('in-forge:plugins.db2Database.paMemberId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pageAccessDetail.get('MEMBER');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.paTabschema'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pageAccessDetail.get('TABSCHEMA');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.paTabname'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pageAccessDetail.get('TABNAME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.paReclaimWaitTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pageAccessDetail.get('RECLAIM_WAIT_TIME');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.paObjtType'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.pageAccessDetail.get('OBJTYPE');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'pageAccess')
    };
  },
  function PageAccessDetailsTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const pageAccessDetails = data.get('raw_payload');
    if (pageAccessDetails.size === 0) {
      return null;
    }

    const rows = pageAccessDetails.toArray().map((pageAccessDetail, idx) => {
      return {
        key: String(idx),
        pageAccessDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.pageAccessDetails')}
            timestamp={data.get('timestamp')}
          />
        }
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
