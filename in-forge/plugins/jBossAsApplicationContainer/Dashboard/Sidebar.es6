import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import {yesOrNo} from 'in-services/formatters/boolean';
import {emptyMap} from 'in-services/fixedImmutables';

import Info from '../Info';


export default function JBossAsSidebar({snapshot}) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap);
  const sockets = snapshot.getIn(['data', 'sockets'], emptyMap);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>JBoss Application Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      { deployments.size > 0 ?
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Deployments</Collapsible.Header>
          <Collapsible.Content>
            {deployments.map((data, name) =>
              <Collapsible initiallyOpen={false}>
                <Collapsible.Header>{name}</Collapsible.Header>
                <Collapsible.Content>
                  <DescriptionList>
                    <DescriptionItem title='Runtime Name'>
                      {data.get('runtimeName')}
                    </DescriptionItem>
                    <DescriptionItem title='Context Root'>
                      {data.get('contextRoot')}
                    </DescriptionItem>
                    <DescriptionItem title='Enabled'>
                      {yesOrNo(data.get('enabled'))}
                    </DescriptionItem>
                    <DescriptionItem title='Status'>
                      {data.get('status')}
                    </DescriptionItem>
                  </DescriptionList>
                </Collapsible.Content>
              </Collapsible>
            ).valueSeq().toArray()}
          </Collapsible.Content>
        </Collapsible>
      : null }
      { sockets.size > 0 ?
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Sockets</Collapsible.Header>
          <Collapsible.Content>
            {sockets.map((data, name) =>
              <Collapsible initiallyOpen={false}>
                <Collapsible.Header>{name}</Collapsible.Header>
                <Collapsible.Content>
                  <DescriptionList>
                    <DescriptionItem title='Port'>
                      {data.get('port')}
                    </DescriptionItem>
                  </DescriptionList>
                </Collapsible.Content>
              </Collapsible>
            ).valueSeq().toArray()}
          </Collapsible.Content>
        </Collapsible>
      : null }
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
