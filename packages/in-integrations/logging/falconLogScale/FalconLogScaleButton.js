/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem } from '@instana/components';

import { integrationKey as falconLogScaleIntegrationKey } from 'in-integrations/logging/falconLogScale/consts';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { useJumpToThirdParty } from 'in-integrations/logging/tracking';
import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank } from 'in-services/util/string';

export default function FalconLogScaleButton(props) {
  const { falconLogScaleIntegration: integration } = props;
  const jumpToThirdParty = useJumpToThirdParty();

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <CarbonMenuItem
      label="Falcon Log Scale"
      onClick={() => {
        jumpToThirdParty(falconLogScaleIntegrationKey);
        window.open(constructFalconLogScaleLink(integration, props), '_blank');
      }}
    />
  );
}

function constructFalconLogScaleLink(integration, props) {
  const { timeConfig } = props;
  const queryParameters = {
    query: serializeQuery(props)
  };

  if (timeConfig.to) {
    queryParameters.start = timeConfig.to - timeConfig.windowSize;
    queryParameters.end = timeConfig.to;
  } else {
    queryParameters.start = formatDurationAccurately(timeConfig.windowSize);
  }

  return `${integration.url}/${integration.repository}/search${toParams(queryParameters, '?', '&')}`;
}

function serializeQuery({ hostFqdn, hostName, kubernetesPodName, dockerContainerId, isWithinKubernetes }) {
  let query = '';

  if (kubernetesPodName) {
    query = `kubernetes.pod_name=${kubernetesPodName}`;
  } else if (dockerContainerId) {
    query = `kubernetes.docker_id=${dockerContainerId} or docker.container_id=${dockerContainerId}`;
  } else if (hostFqdn || hostName) {
    const hostParam = hostFqdn ? hostFqdn : hostName;
    if (isWithinKubernetes) {
      query = `kubernetes.host=${hostParam}`;
    } else {
      query = `host=${hostParam} or @host=${hostParam}`;
    }
  }

  return query.trim();
}

export function shouldShowButton(props) {
  const query = serializeQuery(props);
  return !isBlank(query);
}
