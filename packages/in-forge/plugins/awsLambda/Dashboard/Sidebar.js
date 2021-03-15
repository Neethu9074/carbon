/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ServiceInstancesList from 'in-sdk/components/sidebar/ServiceInstancesList';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import TagList from 'in-sdk/components/sidebar/TagList';
import Info from 'in-forge/plugins/awsLambda/Info';
import TriggersList from './TriggersList';
import { t } from 'in-i18n';

export default function AwsLambdaSidebar({ snapshot }) {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.awsLambda.headerLambdaInfo')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>

      <TagList snapshot={snapshot} />

      <TriggersList snapshotId={snapshot.get('id')} />

      <ServiceInstancesList snapshot={snapshot} />
    </div>
  );
}
