/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import RemoteServiceAgentCorrelationComponent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationComponent';
import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsEmr/Info';
import { t } from 'in-i18n';

export default function AwsEmrSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsEmr.headerEMRInfo')}</Collapsible.Header>
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
