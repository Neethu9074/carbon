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
    title: t('in-openstack:imageId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('id');
      }
    }
  },
  {
    title: t('in-openstack:imageName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('name');
      }
    }
  },
  {
    title: t('in-openstack:created'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('created');
      }
    }
  },
  {
    title: t('in-openstack:updated'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('updated');
      }
    }
  },
  {
    title: t('in-openstack:imageSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('imagesize');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-openstack:status'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.imagedetail.get('status');
      }
    }
  }
];

export default connectTo(
  props => {
    snapshotMap = props;
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'imagedetails')
    };
  },
  function ImageTable({ data }) {
    if (!data) {
      return null;
    }

    const { snapshotId, timeConfig } = snapshotMap;
    const image = data.get('raw_payload', []);
    const rows = image
      .keySeq()
      .toArray()
      .map(key => {
        const imagedetail = image.get(key);
        return {
          key: String(key),
          snapshotId,
          timeConfig,
          imagedetail
        };
      });
    return (
      <Table
        withoutPadding
        cardTitle={t('in-openstack:dashboards.imageDetails')}
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
      />
    );
  }
);
