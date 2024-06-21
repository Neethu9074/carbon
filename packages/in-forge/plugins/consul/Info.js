/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function ConsulInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title={t('in-forge:plugins.consul.infoProcessID')}> {data.get('pid')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoNodeName')}> {data.get('nodeName')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoConsulVersion')}>
          {data.get('consul_version')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoState')}>
          {data.get('raft.state', 'Client')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoLeader')}> {data.get('leader')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoPeers')}>{data.get('peers')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoDatacenter')}>{data.get('datacenter')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoCatalogDatacenters')}>
          {data.get('catalog.datacenters')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoNodeID')}> {data.get('nodeID')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoAdvertiseAddress')}>
          {data.get('advertiseAddr')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoDomain')}>{data.get('domain')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoLogLevel')}> {data.get('logLevel')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoBuildRevision')}>{data.get('revision')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoBuildVersion')}>{data.get('version')}</DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoProtocolVersion')}>
          {data.get('raft.protocolVersion')}
        </DescriptionItem>
        <DescriptionItem title={t('in-forge:plugins.consul.infoLastContact')}>
          {data.get('raft.lastContact')}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
