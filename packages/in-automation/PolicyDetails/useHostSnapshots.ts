/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { fromJS } from 'immutable';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import { useAgentSnapShots } from 'in-automation/RunActionDialog/RunActionDialog';
import getHostSnapshotId from 'in-subscription/getHostSnapshotId';
import { getSnapshot } from 'in-stores/snapshot/snapshot';

export function useHostSnapshots(data: any) {
  const agentSnapShots = useAgentSnapShots({ action: data });
  const [onlineAgents, setOnlineAgents] = useState<any[]>([]);

  useEffect(() => {
    const newOnline = agentSnapShots?.data?.online || [];
    if (!isEqual(newOnline, onlineAgents)) {
      setOnlineAgents(newOnline);
    }
  }, [agentSnapShots?.data?.online, onlineAgents]);

  const hostSnapshots = useObservable(() => {
    const getHostSnapshotIds = onlineAgents.map(agent => getHostSnapshotId(fromJS(agent)).map(id => ({ id, agent })));

    return combineLatest(getHostSnapshotIds).flatMap(hostData =>
      combineLatest(
        hostData.map(({ id, agent }) => {
          return getSnapshot(id).map(hostSnapshot => ({
            hostSnapshot,
            agent
          }));
        })
      )
    );
  }, [onlineAgents]);

  return { hostSnapshots };
}
