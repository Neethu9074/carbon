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
    title: t('in-openstack:flavorId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('id');
      }
    }
  },
  {
    title: t('in-openstack:flavorName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('name');
      }
    }
  },
  {
    title: t('in-openstack:cpus'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('cpus');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:memory'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('ram');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:rootDisk'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('disk');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:ephemeral'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('ephemeral');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:vCpu'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.flavordetail.get('vcpus');
      },
      getContent: number.compact
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'flavordetails')
    };
  },
  function FlavorTable({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const flavor = data.get('raw_payload', []);
    const rows = flavor
      .keySeq()
      .toArray()
      .map(key => {
        const flavordetail = flavor.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          flavordetail
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.flavorDetails')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
