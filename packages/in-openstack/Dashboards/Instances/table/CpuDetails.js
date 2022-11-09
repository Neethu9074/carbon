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
    title: t('in-openstack:cpuId'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.cpudetail.get('id');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:cpuUtilization'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.cpudetail.get('utilization');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'cpudetails')
    };
  },
  function CpuDetails({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const cpu = data.get('raw_payload', []);
    const rows = cpu
      .keySeq()
      .toArray()
      .map(key => {
        const cpudetail = cpu.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          cpudetail
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.cpuDetails')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
