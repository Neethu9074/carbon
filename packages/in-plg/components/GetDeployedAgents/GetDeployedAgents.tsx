/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useEffect, useState } from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import LayoutSection from 'in-plg/pages/onboarding/Layout/LayoutSection';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import { AgentSnapshotResponse } from 'in-plg/api/AgentSnapshot';
import createTracker from 'in-waiting-for-deployment/tracker';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import { getAgentSnapshots } from 'in-plg/api/NetworkUtil';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

export const DATASOURCE = {
  AGENT: 'agent',
  COLLECTOR: 'collector'
} as const;

type DatasourceType = (typeof DATASOURCE)[keyof typeof DATASOURCE];

interface GetDeployedAgentsProps {
  agent: string;
  fromOnboarding?: boolean;
  datasource?: DatasourceType;
}

const trackingService = createTracker('agent.installation');

const GetDeployedAgents = ({
  agent,
  fromOnboarding = false,
  datasource = DATASOURCE.AGENT
}: GetDeployedAgentsProps): JSX.Element | null => {
  const timeConfig = useTimeConfig();
  const DEPLOYED_AGENT_CHECK_INTERVAL: number = 10000;
  const [deployedAgentsCount, setDeployedAgentsCount] = useState<number>(0);
  const [intervalCounter, setIntervalCounter] = useState<number>(0);
  const [timerActive, setTimerActive] = useState<boolean>(true);
  const [isCollectorPresent, setIsCollectorPresent] = useState(false);
  let infraQuery = agent;

  if (datasource === DATASOURCE.COLLECTOR) {
    infraQuery = encodeURIComponent('entity.otel.attribute:entity.type=otel-collector');
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

  useEffect(() => {
    // If the new OpenTelemetry page is not enabled, we don't need to check for OTel collectors.
    // If the datasource is agent, we don't need to check for OTel collectors.
    if (!newOTelPageEnabled || datasource === DATASOURCE.AGENT) {
      return;
    }

    // We check if there is at least one OTel collector entity present.
    const subscription = getEntities({
      filter: {
        tagFilterExpression: {
          logicalOperator: 'AND',
          type: 'EXPRESSION',
          elements: [
            {
              name: 'otel.attribute.entity.type',
              operator: 'EQUALS',
              value: 'otel-collector',
              type: 'TAG_FILTER',
              entity: NOT_APPLICABLE
            }
          ]
        },
        timeConfig
      },
      order: { by: 'id', direction: 'ASC' },
      type: 'openTelemetry',
      pagination: { retrievalSize: 1 } // We only need to check if atleast one entry is present.
    }).subscribe(result => {
      if (result?.data?.items?.length) {
        setIsCollectorPresent(true);
      } else {
        setIsCollectorPresent(false);
      }
    });
    return () => subscription.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeConfig]);

  return (
    <LayoutSection
      title={
        datasource === DATASOURCE.AGENT
          ? t('in-plg:agentDetails.common.openAgentDashboardOptional')
          : t('in-plg:agentDetails.common.openCollectorDashboardOptional')
      }
    >
      {!fromOnboarding ? (
        <Button
          disabled={datasource === DATASOURCE.AGENT ? !deployedAgentsCount : !isCollectorPresent}
          href={`/#/physical?q=${infraQuery}&timeline.to&timeline.fm&timeline.ar=true`}
          onClick={() => trackingService.deployAgentsButtonClicked()}
        >
          {datasource === DATASOURCE.AGENT
            ? t('in-plg:agentDetails.common.viewDeployedAgents')
            : t('in-plg:agentDetails.common.viewInstalledCollector')}
        </Button>
      ) : null}
    </LayoutSection>
  );
};

export default GetDeployedAgents;
