/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import { t } from 'in-i18n';
import Info from '../Info';

export default function GcpPubSubTopicSidebar({ snapshot }) {
  return (
    <Fragment>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.googleCloudPubSubTopic.dashboard.topicInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
      <TagList snapshot={snapshot} />
      <ServiceInstancesList snapshot={snapshot} />
    </Fragment>
  );
}
