import React from 'react';

import {DescriptionList, DescriptionItem} from 'in-components/DescriptionList';
import {formatDateTime} from 'in-services/formatters/date';
import {yesOrNo} from 'in-services/formatters/boolean';
import MetricValue from 'in-components/MetricValue';


const secondsFormatter = d => d + 's';
const secondsAgoFormatter = d => d + 's ago';
const syncInProgressFormatter = d => yesOrNo(d > 0);

export default function RedisInfo({snapshot}) {
  const data = snapshot.get('data');
  const masterLinkStatus = data.get('master_link_status');
  const snapshotId = snapshot.get('id');
  const role = data.get('role');

  return (
    <DescriptionList>
      <DescriptionItem title='Version'>
        {data.get('version')}
      </DescriptionItem>
      <DescriptionItem title='Port'>
        {data.get('port')}
      </DescriptionItem>
      <DescriptionItem title='Max Memory'>
        {data.get('max_memory')}
      </DescriptionItem>
      <DescriptionItem title='Max Clients'>
        {data.get('maxclients')}
      </DescriptionItem>
      <DescriptionItem title='Started At'>
        {formatDateTime(data.get('started_at'))}
      </DescriptionItem>
      <DescriptionItem title='Role'>
          {role}
      </DescriptionItem>
      <DescriptionItem title='Cluster Enabled'>
          {yesOrNo(data.get('cluster_enabled') === 1)}
      </DescriptionItem>
      {role === 'master' ?
        <DescriptionItem title='Number of Slaves'>
          <MetricValue metric={'master_connected_slaves'}
                       snapshotId={snapshotId} />
        </DescriptionItem>
      : null}
      {role === 'slave' ?
        <DescriptionItem title='Master Host'>
          {data.get('master_host')}
        </DescriptionItem>
      : null}
      {role === 'slave' ?
        <DescriptionItem title='Master Port'>
          {data.get('master_port')}
        </DescriptionItem>
      : null}
      {role === 'slave' ?
        <DescriptionItem title='Master Link Status'>
          {masterLinkStatus}
        </DescriptionItem>
      : null}
      {masterLinkStatus === 'down' && role === 'slave' ?
        <DescriptionItem title='Master Downtime'>
          <MetricValue metric={'master_downtime_seconds'}
                       snapshotId={snapshotId}
                       formatter={secondsFormatter} />
        </DescriptionItem>
      : null}
      {role === 'slave' ?
        <DescriptionItem title='Sync in Progress'>
          <MetricValue metric={'master_sync_left_bytes'}
                       snapshotId={snapshotId}
                       formatter={syncInProgressFormatter} />
        </DescriptionItem>
      : null}
      {role === 'slave' ?
        <DescriptionItem title='Last Interaction with Master'>
          <MetricValue metric={'master_last_io_seconds_ago'}
                       snapshotId={snapshotId}
                       formatter={secondsAgoFormatter} />
        </DescriptionItem>
      : null}
    </DescriptionList>
  );
}
