import React from 'react';

import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import Separator from 'in-sdk/components/sidebar/Separator';

import Info from '../Info';

export default function TomcatSidebar({ snapshot }) {
  const connectors = snapshot.getIn(['data', 'connector-config']);
  const executors = snapshot.getIn(['data', 'executor-config']);
  const webapps = snapshot.getIn(['data', 'webapps']);

  return (
    <div>
      <Separator />

      <Collapsible initiallyOpen>
        <Collapsible.Header>Tomcat</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {webapps && webapps.size > 0
        ? <div>
            <Separator />

            <Collapsible initiallyOpen>
              <Collapsible.Header>Webapps</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  {webapps
                    .map((data, name) => [
                      <DescriptionItem title="Context" addSeparator>
                        {name}
                      </DescriptionItem>,
                      <DescriptionItem title="Session Timeout">
                        {data.get('session-timeout')}
                      </DescriptionItem>
                    ])
                    .valueSeq()}
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        : null}

      {connectors && connectors.size > 0
        ? <div>
            <Separator />

            <Collapsible initiallyOpen={false}>
              <Collapsible.Header>Connectors</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  {connectors
                    .map(data => [
                      <DescriptionItem title="Port" addSeparator>
                        {data.get('port')}
                      </DescriptionItem>,
                      <DescriptionItem title="Executor">
                        {data.get('executor')}
                      </DescriptionItem>,
                      <DescriptionItem title="Max Threads">
                        {data.getIn(['threads', 'max'])}
                      </DescriptionItem>,
                      <DescriptionItem title="Max Connections">
                        {data.getIn(['connections', 'max'])}
                      </DescriptionItem>,
                      <DescriptionItem title="Connect Timeout">
                        {data.get('connect-timeout')}
                      </DescriptionItem>,
                      <DescriptionItem title="Keepalive Timeout">
                        {data.get('keepalive-timeout')}
                      </DescriptionItem>
                    ])
                    .valueSeq()}
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        : null}

      {executors && executors.size > 0
        ? <div>
            <Separator />

            <Collapsible initiallyOpen={false}>
              <Collapsible.Header>Executors</Collapsible.Header>
              <Collapsible.Content>
                <DescriptionList>
                  {executors
                    .map(data => [
                      <DescriptionItem title="Max Threads" addSeparator>
                        {data.get('maxThreads')}
                      </DescriptionItem>,
                      <DescriptionItem title="Max Idle">
                        {data.get('maxIdleTime')}
                      </DescriptionItem>,
                      <DescriptionItem title="Core Pool">
                        {data.get('corePoolSize')}
                      </DescriptionItem>
                    ])
                    .valueSeq()}
                </DescriptionList>
              </Collapsible.Content>
            </Collapsible>
          </div>
        : null}
      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshotId={snapshot.get('id')} />
    </div>
  );
}
