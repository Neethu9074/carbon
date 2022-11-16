/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

let snapshotMap = {};

const cols = [
  {
    title: t('in-openstack:readBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.diskdetail.get('readBytes');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:writeBytes'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.diskdetail.get('writeBytes');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:readRequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.diskdetail.get('readRequests');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:writeRequests'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.diskdetail.get('writeRequests');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:errorsCount'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.diskdetail.get('errorsCount');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'diskdetails')
    };
  },
  function DiskDetails({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const disk = data.get('raw_payload', []);
    const rows = disk
      .keySeq()
      .toArray()
      .map(key => {
        const diskdetail = disk.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          diskdetail
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.diskDetails')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
