/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function GlassfishInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.processId')}>
        {data.get('pid')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.port')}>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.version')}>
        {data.get('version')}
      </DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.glassfishApplicationContainer.domainName')}>
        {data.get('domain_name')}
      </DescriptionItem>
    </DescriptionList>
  );
}
