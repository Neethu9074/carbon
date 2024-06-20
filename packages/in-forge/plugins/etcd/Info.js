/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { t } from 'in-i18n';

export default function EtcdInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.etcd.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.etcd.clusterVersion')}>{data.get('version_cluster')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.etcd.serverVersion')}>{data.get('version_server')}</DescriptionItem>
      {data.get('apiVersion') >= 3 ? (
        <DescriptionItem title={t('in-forge:plugins.etcd.apiVersion')}>{data.get('apiVersion')}</DescriptionItem>
      ) : undefined}
      <DescriptionItem title={t('in-forge:plugins.etcd.id')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.etcd.name')}>{data.get('name')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.etcd.leaderId')}>{data.get('leader_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.etcd.state')}>{data.get('state')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
    </DescriptionList>
  );
}
