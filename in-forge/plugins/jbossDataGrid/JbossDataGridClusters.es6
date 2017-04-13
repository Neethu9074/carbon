import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { emptyMap } from 'in-services/fixedImmutables';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { msZeroDecimalPlaces } from 'in-services/formatters/number';

const formatBoolean = value => (value ? 'Yes' : 'No');
const nullOrFormatBoolean = value => (value == null ? null : formatBoolean(value));
const nullOrMsZeroDecimalPlaces = value => (value == null ? null : msZeroDecimalPlaces(value));

export default function JbossDataGridClusters({ snapshot }) {
  const data = snapshot.get('data');
  const clusters = data.get('clusters', emptyMap);

  return (
    <div>
      {clusters
        .map((clusterInfo, clusterName) => (
          <Collapsible initiallyOpen={false} key={clusterName}>
            <Collapsible.Header>JGroups Cluster [{clusterName}]</Collapsible.Header>
            <Collapsible.Content>
              <DescriptionList>
                <DescriptionItem title="Channel Name">
                  {clusterInfo.get('channelName')}
                </DescriptionItem>
                <DescriptionItem title="Channel Address">
                  {clusterInfo.get('channelAddress')}
                </DescriptionItem>
                <DescriptionItem title="Channel State">
                  {clusterInfo.get('channelState')}
                </DescriptionItem>
                <DescriptionItem title="Channel Statistics Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('channelStats'))}
                </DescriptionItem>
                <DescriptionItem title="UDP Statistics Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('udpStats'))}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('thread_pool.enabled'))}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Max Threads">
                  {clusterInfo.get('thread_pool.max_threads')}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Min Threads">
                  {clusterInfo.get('thread_pool.min_threads')}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Keep Alive Time">
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('thread_pool.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Queue Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('thread_pool.queue_enabled'))}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Queue Max Size">
                  {clusterInfo.get('thread_pool.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title="Incoming Messages Thread Pool Rejection Policy">
                  {clusterInfo.get('thread_pool.rejection_policy')}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('oob_thread_pool.enabled'))}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Max Threads">
                  {clusterInfo.get('oob_thread_pool.max_threads')}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Min Threads">
                  {clusterInfo.get('oob_thread_pool.min_threads')}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Keep Alive Time">
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('oob_thread_pool.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Queue Enabled">
                  {nullOrFormatBoolean(clusterInfo.get('oob_thread_pool.queue_enabled'))}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Queue Max Size">
                  {clusterInfo.get('oob_thread_pool.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title="OOB Messages Thread Pool Rejection Policy">
                  {clusterInfo.get('oob_thread_pool.rejection_policy')}
                </DescriptionItem>
                <DescriptionItem title="Timer Thread Pool Max Threads">
                  {clusterInfo.get('timer.max_threads')}
                </DescriptionItem>
                <DescriptionItem title="Timer Thread Pool Min Threads">
                  {clusterInfo.get('timer.min_threads')}
                </DescriptionItem>
                <DescriptionItem title="Timer Thread Pool Keep Alive Time">
                  {nullOrMsZeroDecimalPlaces(clusterInfo.get('timer.keep_alive_time'))}
                </DescriptionItem>
                <DescriptionItem title="Timer Thread Pool Queue Max Size">
                  {clusterInfo.get('timer.queue_max_size')}
                </DescriptionItem>
                <DescriptionItem title="Timer Thread Pool Rejection Policy">
                  {clusterInfo.get('timer.rejection_policy')}
                </DescriptionItem>
              </DescriptionList>
            </Collapsible.Content>
          </Collapsible>
        ))
        .valueSeq()
        .toArray()}
    </div>
  );
}
