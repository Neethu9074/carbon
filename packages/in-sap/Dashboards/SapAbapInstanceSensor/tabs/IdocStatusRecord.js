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
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('MANDT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.dateOfStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('LOGDAT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.timeOfStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('LOGTIM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.iDocStatusCounter'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('COUNTR');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.dateRecordWasCreated'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('CREDAT');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.timeRecordWasCreated'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('CRETIM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('STATUS');
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
        return row.idocDetail.get('UNAME');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'idocStatusRecord')
    };
  },
  function IdocStatusRecord({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const idocDetails = data.get('raw_payload');
    if (idocDetails.size === 0) {
      return null;
    }

    const rows = idocDetails.toArray().map((idocDetail, idx) => {
      return {
        key: String(idx),
        idocDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.idocStatusRecords')} />}
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
