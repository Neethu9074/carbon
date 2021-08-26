/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import TimeOfLastUpdateCardTitle from 'in-sdk/components/dashboard/TimeOfLastUpdateCardTitle';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytes } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.userSpoolSpace.userName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.userSpoolSpace.get('userName');
      }
    }
  },
  {
    title: t('in-forge:plugins.ibmIOs.dashboard.tables.userSpoolSpace.userSpoolSpace'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.userSpoolSpace.get('userSpoolSpace');
      },
      getContent: bytes.detailed
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'userSpoolSpaceList')
    };
  },
  function userSpoolSpaceTable({ data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }
    const userSpoolSpaceList = data.get('raw_payload');
    if (userSpoolSpaceList.size === 0) {
      return null;
    }

    const rows = userSpoolSpaceList.toArray().map((userSpoolSpace, idx) => {
      return {
        key: String(idx),
        userSpoolSpace
      };
    });

    return (
      <Table
        withoutPadding
        cardTitle={
          <TimeOfLastUpdateCardTitle
            title={t('in-forge:plugins.ibmIOs.dashboard.tables.userSpoolSpace.name')}
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
