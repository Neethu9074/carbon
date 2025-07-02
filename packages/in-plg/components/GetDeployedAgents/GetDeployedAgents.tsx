/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import { AgentSnapshotResponse } from 'in-plg/api/AgentSnapshot';
import createTracker from 'in-waiting-for-deployment/tracker';
import { getAgentSnapshots } from 'in-plg/api/NetworkUtil';
import { t } from 'in-i18n';

interface GetDeployedAgentsProps {
  agent: string;
  fromOnboarding?: boolean;
  datasource?: 'agent' | 'collector';
}

const trackingService = createTracker('agent.installation');

const GetDeployedAgents = ({
  agent,
  fromOnboarding = false,
  datasource = 'agent'
}: GetDeployedAgentsProps): JSX.Element | null => {
  const DEPLOYED_AGENT_CHECK_INTERVAL: number = 10000;
  const [deployedAgentsCount, setDeployedAgentsCount] = useState<number>(0);
  const [intervalCounter, setIntervalCounter] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  let infraQuery = agent;

  if (datasource === 'collector') {
    infraQuery = 'entity.otel.attribute:entity.type=otel-collector';
  }

  const agentSnapshots: AgentSnapshotResponse | null | undefined = useObservable<AgentSnapshotResponse, []>(
    getAgentSnapshots(agent),
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (deployedAgentsCount === 0 && timerActive) {
        setIntervalCounter(intervalCounter + 1);
      }
    }, DEPLOYED_AGENT_CHECK_INTERVAL);

    if (deployedAgentsCount > 0) {
      clearInterval(interval);
      setTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [deployedAgentsCount, intervalCounter, timerActive]);

  useEffect(() => {
    if (agentSnapshots?.items) {
      setDeployedAgentsCount(agentSnapshots.items.length);
    }
  }, [agentSnapshots]);

  return (
    <LayoutSection title={t('in-plg:agentDetails.common.openAgentDashboardOptional')}>
      {!fromOnboarding ? (
        <Button
          disabled={!deployedAgentsCount}
          href={`/#/physical?q=${infraQuery}&timeline.to&timeline.fm&timeline.ar=true`}
          onClick={() => trackingService.deployAgentsButtonClicked()}
        >
          {datasource === 'agent'
            ? t('in-plg:agentDetails.common.viewDeployedAgents')
            : t('in-plg:agentDetails.common.viewInstalledCollector')}
        </Button>
      ) : null}
    </LayoutSection>
  );
};

export default GetDeployedAgents;
