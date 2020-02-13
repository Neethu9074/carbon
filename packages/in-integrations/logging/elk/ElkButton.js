import React from 'react';

import { formatDurationAccurately } from 'in-services/formatters/date';
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

  let basePath = integration.basePath;
  basePath = isBlank(basePath) ? '' : '/' + basePath.trim();

  return `${integration.url}${basePath}/app/kibana#/dashboard/${
    integration.dashboard
  }?_g=()&_a=(query:(language:lucene,query:'${queryParameters.query}'))`;
}

function serializeQuery({ hostName, kubernetesPodName, dockerContainerId, isWithinKubernetes }) {
  let query = '';

  if (kubernetesPodName) {
    query = `kubernetes.pod_name:${kubernetesPodName}`;
  } else if (dockerContainerId) {
    query = `kubernetes.docker_id:${dockerContainerId} or docker.container_id:${dockerContainerId}`;
  } else if (hostName) {
    if (isWithinKubernetes) {
      query = `kubernetes.host${hostName}`;
    } else {
      query = `host.name:${hostName}`;
    }
  }

  return query.trim();
}

export function shouldShowButton(props) {
  return !isBlank(serializeQuery(props));
}
