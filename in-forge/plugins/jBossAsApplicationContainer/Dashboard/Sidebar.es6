import irpt from 'react-immutable-proptypes';
import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import JBossAsInfo from '../JBossAsInfo';


const formatBoolean = value => value ? 'Yes' : 'No';

export default function JBossAsSidebar({snapshot}) {
  const deployments = snapshot.getIn(['data', 'deployments']);
  const sockets = snapshot.getIn(['data', 'sockets']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>JBoss Application Server</Collapsible.Header>
        <Collapsible.Content>
          <JBossAsInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      { deployments ?
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
                      {formatBoolean(data.get('enabled'))}
                    </DescriptionItem>
                    <DescriptionItem title='Status'>
                      {data.get('status')}
                    </DescriptionItem>
                  </DescriptionList>
                </Collapsible.Content>
              </Collapsible>
            ).valueSeq()}
          </Collapsible.Content>
        </Collapsible>
      : null }
      { sockets ?
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
            ).valueSeq()}
          </Collapsible.Content>
        </Collapsible>
      : null }
      <RunningComponentsList snapshotId={snapshot.get('id')} />
    </div>
  );
}

JBossAsSidebar.propTypes = {
  snapshot: irpt.map.isRequired
};
