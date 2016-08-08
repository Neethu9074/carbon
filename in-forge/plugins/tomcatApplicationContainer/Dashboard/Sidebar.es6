import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';

import TomcatInfo from '../TomcatInfo';


export default function TomcatSidebar({snapshot}) {
  const connectors = snapshot.getIn(['data', 'connector-config']);
  const webapps = snapshot.getIn(['data', 'webapps']);

  return (
    <div>
      <Collapsible initiallyOpen={true}>
        <Collapsible.Header>Tomcat</Collapsible.Header>
        <Collapsible.Content>
          <TomcatInfo snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      { webapps ?
        <Collapsible initiallyOpen={true}>
          <Collapsible.Header>Webapps</Collapsible.Header>
          <Collapsible.Content>
            {webapps.map((data, name) =>
              <Collapsible initiallyOpen={false}
                           key={name}>
                <Collapsible.Header>{data.get('name')}</Collapsible.Header>
                <Collapsible.Content>
                  <DescriptionList>
                    <DescriptionItem title='Context'>
                      {name}
                    </DescriptionItem>
                    <DescriptionItem title='Session Timeout'>
                      {data.get('session-timeout')}
                    </DescriptionItem>
                  </DescriptionList>
                </Collapsible.Content>
              </Collapsible>
            ).valueSeq()}
          </Collapsible.Content>
        </Collapsible>
      : null }
      { connectors ?
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Connectors</Collapsible.Header>
          <Collapsible.Content>
            {connectors.map((data, name) =>
              <Collapsible initiallyOpen={false}
                           key={name}>
                <Collapsible.Header>{name}</Collapsible.Header>
                <Collapsible.Content>
                  <DescriptionList>
                    <DescriptionItem title='Port'>
                      {data.get('port')}
                    </DescriptionItem>
                    <DescriptionItem title='Max Threads'>
                      {data.getIn(['threads', 'max'])}
                    </DescriptionItem>
                    <DescriptionItem title='Max Connections'>
                      {data.getIn(['connections', 'max'])}
                    </DescriptionItem>
                    <DescriptionItem title='Connect Timeout'>
                      {data.get('connect-timeout')}
                    </DescriptionItem>
                    <DescriptionItem title='Keepalive Timeout'>
                      {data.get('keepalive-timeout')}
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
