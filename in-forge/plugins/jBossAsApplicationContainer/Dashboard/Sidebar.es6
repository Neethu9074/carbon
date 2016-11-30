import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';
import {emptyMap} from 'in-services/fixedImmutables';

import Info from '../Info';


export default function JBossAsSidebar({snapshot}) {
  const deployments = snapshot.getIn(['data', 'deployments'], emptyMap)
    .filter(c => c.get('contextRoot'))
    .sort();
  const sockets = snapshot.getIn(['data', 'sockets'], emptyMap);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>JBoss Application Server</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {deployments.size > 0 ?
        <div>
          <Separator />

          <Collapsible initiallyOpen>
            <Collapsible.Header>Deployments</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                {deployments.map((data, name) =>
                  <DescriptionItem title={name}
                                   key={name}>
                    {data.get('contextRoot')}
                  </DescriptionItem>
                ).valueSeq().toArray()}
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
        </div>
      : null}

      {sockets.size > 0 ?
        <div>
          <Separator />

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
        </div>
      : null}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
