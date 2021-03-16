/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { positiveNumber } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function HAProxyInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.version')}>{data.get('info.version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.name')}>{data.get('info.name')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.hAProxy.maxMemory')}>
        {positiveNumber(data.get('info.memmax'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.maxFileDescriptors')}>
        {positiveNumber(data.get('info.ulimitN'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.maxSockets')}>
        {positiveNumber(data.get('info.maxsock'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.maxConnections')}>
        {positiveNumber(data.get('info.maxconn'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.maxPipes')}>
        {positiveNumber(data.get('info.maxpipes'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hAProxy.sessionRateLimit')}>
        {positiveNumber(data.get('info.sessRateLimit'))}
      </DescriptionItem>
    </DescriptionList>
  );
}
