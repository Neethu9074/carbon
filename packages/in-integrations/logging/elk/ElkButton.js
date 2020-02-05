import React from 'react';

import { formatDurationAccurately } from 'in-services/formatters/date';
import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';

export default function ElkButton(props) {
  const { elkIntegration: integration } = props;

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <Button
      className={props.className}
      kind="secondary"
      icon="lib_elk"
      target="_blank"
      href={constructElkLink(integration, props)}
    >
      ELK
    </Button>
  );
}

function constructElkLink(integration, props) {
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
