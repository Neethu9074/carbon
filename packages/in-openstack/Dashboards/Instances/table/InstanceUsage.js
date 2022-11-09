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
    title: t('in-openstack:driver'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('driver');
      }
    }
  },
  {
    title: t('in-openstack:hypervisor'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('hypervisor');
      }
    }
  },
  {
    title: t('in-openstack:hypervisorOS'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('hypervisorOS');
      }
    }
  },
  {
    title: t('in-openstack:name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('name');
      }
    }
  },
  {
    title: t('in-openstack:vNics'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('numNics');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:vCpu'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.instanceUsage.get('numCpus');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'instance')
    };
  },
  function InstanceUsage({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const instances = data.get('raw_payload', []);
    const rows = instances
      .keySeq()
      .toArray()
      .map(key => {
        const instanceUsage = instances.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          instanceUsage
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.instanceUsage')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
