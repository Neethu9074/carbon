/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import RunningComponentsList from 'in-sdk/components/sidebar/RunningComponentsList';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { positiveNumber } from 'in-services/formatters/number';
import { minutes } from 'in-services/formatters/number';

import Info from '../Info';

export default function TomcatSidebar({ snapshot }) {
  const connectors = snapshot.getIn(['data', 'connector-config']);
  const executors = snapshot.getIn(['data', 'executor-config']);
  const webapps = snapshot.getIn(['data', 'webapps']);

  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>Tomcat</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      {webapps && webapps.size > 0 && (
        <Collapsible initiallyOpen>
          <Collapsible.Header>Webapps</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {webapps.keySeq().map(name => (
                <Fragment key={name}>
                  <DescriptionItem key={name} title="Context" addSeparator>
                    {name}
                  </DescriptionItem>
                  <DescriptionItem title="Session Timeout">
                    {minutes.compact(webapps.getIn([name, 'session-timeout']))}
                  </DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      {connectors && connectors.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Connectors</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {connectors.toArray().map((data, i) => (
                <Fragment key={i}>
                  <DescriptionItem title="Port" addSeparator>
                    {data.get('port')}
                  </DescriptionItem>
                  <DescriptionItem title="Executor">{data.get('executor')}</DescriptionItem>
                  <DescriptionItem title="Max Threads">{data.getIn(['threads', 'max'])}</DescriptionItem>
                  <DescriptionItem title="Max Connections">{data.getIn(['connections', 'max'])}</DescriptionItem>
                  <DescriptionItem title="Connect Timeout">
                    {positiveNumber(data.get('connect-timeout'))}
                  </DescriptionItem>
                  <DescriptionItem title="Keepalive Timeout">
                    {positiveNumber(data.get('keepalive-timeout'))}
                  </DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      {executors && executors.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>Executors</Collapsible.Header>
          <Collapsible.Content>
            <DescriptionList>
              {executors.toArray().map((data, i) => (
                <Fragment key={i}>
                  <DescriptionItem title="Max Threads" addSeparator>
                    {data.get('maxThreads')}
                  </DescriptionItem>
                  <DescriptionItem title="Max Idle">{data.get('maxIdleTime')}</DescriptionItem>
                  <DescriptionItem title="Core Pool">{data.get('corePoolSize')}</DescriptionItem>
                </Fragment>
              ))}
            </DescriptionList>
          </Collapsible.Content>
        </Collapsible>
      )}

      <RunningComponentsList snapshotId={snapshot.get('id')} />
      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
