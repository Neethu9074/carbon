/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { emptyMap } from 'in-services/fixedImmutables';
import { t } from 'in-i18n';
import Info from '../Info';

export default function JBossAsSidebar({ snapshot }) {
  const deployments = snapshot
    .getIn(['data', 'deployments'], emptyMap)
    .filter(c => c.get('contextRoot'))
    .sort();
  const sockets = snapshot.getIn(['data', 'sockets'], emptyMap);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>
          {t('in-forge:plugins.jBossAsApplicationContainer.jBossApplicationServer')}
        </Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {deployments.size > 0 ? (
        <Collapsible initiallyOpen>
          <Collapsible.Header>{t('in-forge:plugins.jBossAsApplicationContainer.deployments')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {deployments
                .map((data, name) => (
                  <DescriptionItem title={name} key={name}>
                    {data.get('contextRoot')}
                  </DescriptionItem>
                ))
                .valueSeq()
                .toArray()}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}

      {sockets.size > 0 ? (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>{t('in-forge:plugins.jBossAsApplicationContainer.ports')}</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {sockets
                .map((data, name) => (
                  <DescriptionItem key={name} title={name}>
                    {data.get('port')}
                  </DescriptionItem>
                ))
                .valueSeq()
                .toArray()}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      ) : null}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
