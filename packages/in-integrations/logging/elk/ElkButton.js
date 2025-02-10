/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem, SvgIcon } from '@instana/components';

import { integrationKey as elkIntegrationKey } from 'in-integrations/logging/elk/consts';
import { useJumpToThirdParty } from 'in-integrations/logging/tracking';
import { isBlank } from 'in-services/util/string';

export default function ElkButton(props) {
  const { elkIntegration: integration } = props;
  const jumpToThirdParty = useJumpToThirdParty();

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <CarbonMenuItem
      renderIcon={() => {
        return <SvgIcon type="lib_elk" />;
      }}
      label="ELK"
      onClick={() => {
        jumpToThirdParty(elkIntegrationKey);
        window.open(constructElkLink(integration, props), '_blank');
      }}
    />
  );
}

function constructElkLink(integration, props) {
  const { timeConfig } = props;

  const basePath = constructBasePath(integration.basePath);
  const timeParams = constructTimeParams(timeConfig);
  const query = serializeQuery(props);

  return `${integration.url}${basePath}/app/kibana#/dashboard/${integration.dashboard}?_g=(refreshInterval:(pause:!t,value:0),time:(mode:absolute,${timeParams}))&_a=(query:(language:lucene,query:'${query}'))`;
}

function serializeQuery({ hostName, kubernetesPodName, dockerContainerId }) {
  let query = '';

  if (kubernetesPodName) {
    query = `kubernetes.pod.name:${kubernetesPodName}`;
  } else if (dockerContainerId) {
    query = `docker.container.id:${dockerContainerId}`;
  } else if (hostName) {
    query = `host.name:${hostName}`;
  }

  return query.trim();
}

export function shouldShowButton(props) {
  return !isBlank(serializeQuery(props));
}

function constructBasePath(basePath) {
  return isBlank(basePath) ? '' : `/${basePath.trim()}`;
}

function constructTimeParams(timeConfig) {
  return timeConfig.to
    ? `from:'${convertToISO(timeConfig.to - timeConfig.windowSize)}',to:'${convertToISO(timeConfig.to)}'`
    : `from:'${convertToISO(Date.now() - timeConfig.windowSize)}'`;
}

function convertToISO(date) {
  return new Date(date).toISOString();
}
