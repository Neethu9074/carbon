/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import TagList from 'in-sdk/components/sidebar/TagList';
import { emptyList } from 'in-services/fixedImmutables';
import Info from 'in-forge/plugins/awsBeanstalk/Info';
import List from 'in-sdk/components/sidebar/List';
import { t } from 'in-i18n';

export default function AwsBeanstalkSidebar({ snapshot }) {
  const data = snapshot.get('data');
  const instanceIds = data.get('instances.ids', emptyList);
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsBeanstalk.labelAWSBeanstalkInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      {instanceIds && instanceIds.size > 0 && (
        <Collapsible initiallyOpen={false}>
          <Collapsible.Header>
            {t('in-forge:plugins.awsBeanstalk.titleInstances', { len: instanceIds.size })}
          </Collapsible.Header>
          <Collapsible.Content>
            <List>
              {instanceIds.map((id, i) => (
                <List.Item key={i}>{id}</List.Item>
              ))}
            </List>
          </Collapsible.Content>
        </Collapsible>
      )}

      <TagList snapshot={snapshot} />

      <ServiceInstancesList snapshot={snapshot} />

      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </div>
  );
}
