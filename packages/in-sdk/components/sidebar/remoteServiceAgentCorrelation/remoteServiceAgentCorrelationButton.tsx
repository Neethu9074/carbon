/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Link } from '@instana/components';

import remoteServiceAgentCorrelationEvent from 'in-sdk/components/sidebar/remoteServiceAgentCorrelation/remoteServiceAgentCorrelationEvent';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
//@ts-expect-error
import connectTo from 'in-hoc/connectTo';
import { isEntityOnline } from 'in-stores/snapshot';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import clickableStyles from 'in-sdk/components/sidebar/ClickableList.mless';

export default connectTo(
  (props: any) => {
    return {
      isOnline: isEntityOnline(props.snapshot.get('id')),
      hostId: remoteServiceAgentCorrelationEvent({ hostId: props.snapshot?.get('volatileId')?.get('host_id') })
    };
  },
  function EnableSelfMonitoringButton({ isOnline, hostId }: { isOnline: boolean; hostId: string }) {
    const href = useGetDashboardLink()(hostId);
    const agentCorrelationLink = (
      <Link className={clickableStyles.link} href={href}>
        {t('in-forge:pluginName_instanaAgent')}
      </Link>
    );

    if (hostId || isOnline || !href) {
      return agentCorrelationLink;
    }

    return (
      <Tooltip content={t('in-forge:plugins.host.dashboard.agentManagementIsOnlyAvailableWhenTheAgentIsRunning')}>
        {agentCorrelationLink}
      </Tooltip>
    );
  }
);
