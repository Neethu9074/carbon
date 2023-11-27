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
    title: t('in-sap:dashboards.idocNumber'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('DOCNUM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.counterInClusterTable'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('COUNTER');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.numberOfSAPSegment'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('SEGNUM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.nameOfSAPSegment'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('SEGNAM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.numberofHierarchicallySegment'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('PSGNUM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.hierarchyLevel'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('HLEVEL');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.lengthField'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.idocDetail.get('DTINT2');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'idocDataRecord')
    };
  },
  function IdocDataRecord({ data }) {
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
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.idocDataRecords')} />}
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
