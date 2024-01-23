/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
    title: t('in-forge:plugins.db2Database.memberId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2MemberDetail.get('ID');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.memberState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2MemberDetail.get('STATE');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.memberHomeHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2MemberDetail.get('HOME_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.memberCurrentHost'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2MemberDetail.get('CURRENT_HOST');
      },
      getContent(args) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-forge:plugins.db2Database.db2MemberAlert'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.db2MemberDetail.get('ALERT');
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
      data: getRawPayloadWithTimestamp(props.snapshotId, 'db2Member')
    };
  },
  function Db2MemberTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const db2MemberDetails = data.get('raw_payload');
    if (db2MemberDetails.size === 0) {
      return null;
    }

    const rows = db2MemberDetails.toArray().map((db2MemberDetail, idx) => {
      return {
        key: String(idx),
        db2MemberDetail
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.db2Database.dashboard.db2MemberDetails')}
            timestamp={data.get('timestamp')}
          />
        }
        cols={cols}
        rows={rows}
        initialSortColumn={1}
        initialSortDirection="desc"
      />
    );
  }
);

function Args({ args }) {
  return <code className={locals.statement}>{args}</code>;
}
