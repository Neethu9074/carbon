/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import ProcessStartedAtDescriptionItem from 'in-sdk/components/sidebar/ProcessStartedAtDescriptionItem';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { yesOrNo } from 'in-services/formatters/boolean';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

const secondsFormatter = d => t('in-forge:plugins.redis.seconds', { number: d });
const secondsAgoFormatter = d => t('in-forge:plugins.redis.secondsAgo', { number: d });
const syncInProgressFormatter = d => yesOrNo(d > 0);
const bytesTwoDecimalPlacesPositiveFormatter = d => (d > 0 ? bytesTwoDecimalPlaces(d) : '-');

export default function RedisInfo({ snapshot }) {
  const data = snapshot.get('data');
  const masterLinkStatus = data.get('master_link_status');
  const snapshotId = snapshot.get('id');
  const role = data.get('role');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.redis.version')}>{data.get('version')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redis.port')}>{data.get('port')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redis.maxMemory')}>
        {bytesTwoDecimalPlacesPositiveFormatter(data.get('max_memory'))}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redis.maxClients')}>{data.get('maxclients')}</DescriptionItem>
      <ProcessStartedAtDescriptionItem snapshotId={snapshot.get('id')} />
      <DescriptionItem title={t('in-forge:plugins.redis.role')}>{role}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.redis.clusterEnabled')}>
        {yesOrNo(data.get('cluster_enabled') === 1)}
      </DescriptionItem>
      {role === 'master' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.numberOfSlaves')}>
          <MetricValue metric={'master_connected_slaves'} snapshotId={snapshotId} />
        </DescriptionItem>
      ) : null}
      {role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.masterHost')}>{data.get('master_host')}</DescriptionItem>
      ) : null}
      {role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.masterPort')}>{data.get('master_port')}</DescriptionItem>
      ) : null}
      {role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.replicationStatus')}>{masterLinkStatus}</DescriptionItem>
      ) : null}
      {masterLinkStatus === 'down' && role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.masterDowntime')}>
          <MetricValue metric={'master_downtime_seconds'} snapshotId={snapshotId} formatter={secondsFormatter} />
        </DescriptionItem>
      ) : null}
      {role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.syncInProgress')}>
          <MetricValue metric={'master_sync_left_bytes'} snapshotId={snapshotId} formatter={syncInProgressFormatter} />
        </DescriptionItem>
      ) : null}
      {role === 'slave' ? (
        <DescriptionItem title={t('in-forge:plugins.redis.lastInteractionWithMaster')}>
          <MetricValue metric={'master_last_io_seconds_ago'} snapshotId={snapshotId} formatter={secondsAgoFormatter} />
        </DescriptionItem>
      ) : null}
    </DescriptionList>
  );
}
