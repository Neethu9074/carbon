/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ClusterStatusLabel from 'in-forge/plugins/elasticsearchCluster/ClusterStatusLabel';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import { getZone } from 'in-stores/zone';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => {
    return {
      zoneSnapshot: getZone(props.snapshot.get('id')).flatMap(getSnapshot)
    };
  },
  function ElasticsearchInfo({ snapshot, zoneSnapshot }) {
    const data = snapshot.get('data');

    return (
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.version')}>{data.get('version')}</DescriptionItem>

        {zoneSnapshot ? (
          <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.cluster')}>
            <SnapshotLink snapshotId={zoneSnapshot.get('id')}>{getLabel(zoneSnapshot)}</SnapshotLink>
          </DescriptionItem>
        ) : null}

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.status')}>
          <ClusterStatusLabel status={data.get('cluster_health.status')} />
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.node')}>{data.get('node.name')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.nodeId')}>{data.get('node.id')}</DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.nodeType')}>
          {data.get('node.type')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.master')}>
          {data.get('node.master')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.masterEligible')}>
          {data.get('node.master_eligible')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.transport')}>
          {data.get('transport')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.http')}>
          {data.get('http.address')}
        </DescriptionItem>

        <DescriptionItem title={t('in-forge:plugins.elasticsearchNode.logDirectory')}>
          {data.get('log.dir')}
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
