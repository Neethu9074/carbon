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
    title: t('in-sap:dashboards.tID'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TID');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.guiVersion'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('GUIVERSION');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('BNAME');
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
        return row.userDetail.get('TCODE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.term'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TERM');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.hostAddress'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('HOSTADDR');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:dashboards.type'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.userDetail.get('TYPE');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.dialogTime'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return formatTime(row.userDetail.get('ZEIT'));
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'userInfo')
    };
  },
  function UserInfo({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const userDetails = data.get('raw_payload');
    if (userDetails.size === 0) {
      return null;
    }

    const rows = userDetails.toArray().map((userDetail, idx) => {
      return {
        key: String(idx),
        userDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={<TimeOfLastUpdateCardTitle title={t('in-sap:dashboards.userInfo')} />}
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

function formatTime(timeString) {
  const hours = timeString.substring(0, 2);
  const minutes = timeString.substring(2, 4);
  const seconds = timeString.substring(4, 6);
  return `${hours}:${minutes}:${seconds}`;
}
