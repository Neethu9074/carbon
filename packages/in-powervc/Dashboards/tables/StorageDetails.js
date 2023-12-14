/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
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
    title: t('in-powervc:name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.volume.get('name');
      }
    }
  },
  {
    title: t('in-powervc:ip'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.volume.get('ip');
      }
    }
  },
  {
    title: t('in-powervc:state'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.volume.get('state');
      }
    }
  },
  {
    title: t('in-powervc:volumeCount'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.volume.get('volumeCount');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-powervc:availableCapacity'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.volume.get('availableCapacity');
      },
      getContent: number.detailed
    }
  },
  {
    title: t('in-powervc:totalCapacity'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.volume.get('totalCapacity');
      },
      getContent: number.detailed
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'volumes')
    };
  },

  function StorageDetails({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const volumeDetail = data.get('raw_payload', []);
    const rows = volumeDetail
      .keySeq()
      .toArray()
      .map(key => {
        const volume = volumeDetail.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          volume
        };
      });

    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.storage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
