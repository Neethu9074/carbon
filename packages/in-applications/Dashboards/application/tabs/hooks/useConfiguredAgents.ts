/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useObservable } from '@instana/hooks';

import getAgentSnapshotsInTimeframe, { OUT } from 'in-subscription/getAgentSnapshotsInTimeframe';
import useTimeConfig from 'in-hooks/useTimeConfig';

export function useConfiguredAgents(actionType: 'concert' | 'turbo') {
  const timeConfig = useTimeConfig();

  const query =
    actionType === 'turbo' ? 'entity.agent.capability:turbonomic-action' : 'entity.agent.capability:cve-vulnerability';

  const agentSnapShots: OUT | null | undefined = useObservable(
    () => getAgentSnapshotsInTimeframe({ timeConfig, query }),
    [timeConfig, query]
  );

  return agentSnapShots;
}
