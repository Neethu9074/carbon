/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible, DescriptionItem, DescriptionList } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
// @ts-expect-error Module needs to be translated to TS
import TagList from 'in-sdk/components/sidebar/TagList';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { emptyList } from 'in-services/fixedImmutables';
import Info from 'in-forge/plugins/awsAppSync/Info';
import { t } from 'in-i18n';

export default function AwsAppSyncSidebar({ snapshot }: { snapshot: SnapshotData }) {
  const dataSources = snapshot.getIn(['data', 'data_sources'], emptyList);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsAppSync.headerAppSyncInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      {dataSources.size > 0 ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.awsAppSync.dataSources')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {dataSources
                .map((ds: any) => (
                  <DescriptionItem key={ds.get('data_source_name')} title={ds.get('data_source_name')}>
                    {ds.get('data_source_type')}
                  </DescriptionItem>
                ))
                .valueSeq()
                .toArray()}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
