/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function VarnishInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.version')}>{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.infoTitle.threadPools')}>{data.get('thread_pools')}</DescriptionItem>
    </DescriptionList>
  );
}
