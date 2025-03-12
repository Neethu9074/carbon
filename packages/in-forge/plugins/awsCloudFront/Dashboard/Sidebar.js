/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsCloudFront/Info';
import { t } from 'in-i18n';

export default function AwsCloudFrontSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsCloudFront.headerCloudFrontInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <ServiceInstancesList snapshot={snapshot} />

      <RemoteServiceAgentCorrelationComponent snapshot={snapshot} />
    </div>
  );
}
