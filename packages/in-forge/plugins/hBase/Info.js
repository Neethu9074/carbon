/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { formatDateTime } from 'in-services/formatters/date';
import { t } from 'in-i18n';

export default function HBaseInfo({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.hBase.processId')}>{data.get('pid')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.version')}>{data.get('version')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.hBase.sinks')}>{data.get('sinks')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.sources')}>{data.get('sources')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.regionServers')}>{data.get('region_servers')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.deadRegionServers')}>
        {data.get('dead_region_servers')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.clusterId')}>{data.get('cluster_id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.activeMaster')}>{data.get('active_master')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.serverName')}>
        {formatServerName(data.get('server_name'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.regionServer')}>
        {formatServerName(data.get('region_server'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.hBase.zookeeper')}>{data.get('zookeeper')}</DescriptionItem>
    </DescriptionList>
  );
}

function formatServerName(name) {
  if (name) {
    const splitName = name.split(',');
    return splitName[0] + ':' + splitName[1] + ' / ' + formatDateTime(parseInt(splitName[2]));
  }
  return null;
}
