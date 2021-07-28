/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Bash, Input } from 'in-waiting-for-deployment/components/OnboardingWidget/contentComponents';
import { t } from 'in-i18n';

export default function DockerContent({ agentKey, agentEndpoint, agentEndpointPort }) {
  const [zoneName, onZoneNameChange] = useState('');
  const lines = [
    'sudo docker run \\',
    '   --detach \\',
    '   --name instana-agent \\',
    '   --volume /var/run:/var/run \\',
    '   --volume /run:/run \\',
    '   --volume /dev:/dev:ro \\',
    '   --volume /sys:/sys:ro \\',
    '   --volume /var/log:/var/log:ro \\',
    '   --privileged \\',
    '   --net=host \\',
    '   --pid=host \\',
    `   --env="INSTANA_AGENT_ENDPOINT=${agentEndpoint}" \\`,
    `   --env="INSTANA_AGENT_ENDPOINT_PORT=${agentEndpointPort}" \\`,
    `   --env="INSTANA_AGENT_KEY=${agentKey}" \\`,
    '   instana/agent'
  ];
  if (zoneName) {
    lines.push(`   --env="INSTANA_AGENT_ZONE=${zoneName}" \\`, lines.pop());
  }

  return (
    <>
      <Input
        id="zone-name"
        value={zoneName}
        onChange={onZoneNameChange}
        placeholder={t('in-waiting-for-deployment:content.agentZoneOptional')}
      />
      <Bash lines={lines} />
    </>
  );
}
