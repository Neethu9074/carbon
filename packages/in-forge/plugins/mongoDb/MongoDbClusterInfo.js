/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import getMongoDbClusterForNode from 'in-forge/plugins/mongoDb/subscriptions/getMongoDbClusterForNode';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    clusterSnapshot: timeConfig$
      .flatMap(timeConfig => getMongoDbClusterForNode({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
  }),

  function MongoDbClusterInfo({ clusterSnapshot, data }) {
    if (!clusterSnapshot) {
      return null;
    }

    return (
      <div>
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.mongoDb.atlasCluster')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.name')}>
                <SnapshotLink snapshotId={clusterSnapshot.get('id')}>{data.get('clusterName')}</SnapshotLink>
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.type')}>{data.get('clusterType')}</DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.cloudProvider')}>
                {data.get('clusterProvider')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.region')}>
                {data.get('clusterRegion')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.project')}>
                {data.get('clusterProjectName')}
              </DescriptionItem>
              <DescriptionItem title={t('in-forge:plugins.mongoDb.organisation')}>
                {data.get('clusterOrganisationName')}
              </DescriptionItem>
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      </div>
    );
  }
);
