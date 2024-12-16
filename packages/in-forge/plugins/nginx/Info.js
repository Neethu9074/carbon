/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function NginxInfo({ snapshot }) {
  const data = snapshot.get('data');
  const isNginxPlus = snapshot.getIn(['data', 'version'], 'nginx').indexOf('nginx-plus') !== -1;

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.nginx.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nginx.workerProcesses')}>
        {data.get('worker_processes')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nginx.workerConnections')}>
        {data.get('worker_connections')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.nginx.version')}>{data.get('version')}</DescriptionItem>
      {isNginxPlus && <DescriptionItem title={t('in-forge:plugins.nginx.build')}>{data.get('build')}</DescriptionItem>}
      {isNginxPlus && (
        <DescriptionItem title={t('in-forge:plugins.nginx.address')}>{data.get('address')}</DescriptionItem>
      )}
      {isNginxPlus && (
        <DescriptionItem title={t('in-forge:plugins.nginx.generation')}>{data.get('generation')}</DescriptionItem>
      )}
      {isNginxPlus && <DescriptionItem title={t('in-forge:plugins.nginx.ppid')}>{data.get('ppid')}</DescriptionItem>}
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
