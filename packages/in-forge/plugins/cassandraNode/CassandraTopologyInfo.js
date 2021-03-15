/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshotId).flatMap(getSnapshot)
    };
  },
  function CassandraTopologyInfo({ snapshot, zoneSnapshot }) {
    const data = snapshot.get('data');

    return (
      <DescriptionList>
        {zoneSnapshot && (
          <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleCluster')}>
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
          </DescriptionItem>
        )}
        <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleDatacenter')}>
          {data.get('datacenter')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleRack')}>{data.get('rack')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.cassandraNode.titleHostID')}>{data.get('hostId')}</DescriptionItem>
      </DescriptionList>
    );
  }
);
