import React from 'react';

import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { formatDurationAccurately } from 'in-services/formatters/date';
import { integrationKey } from 'in-integrations/logging/humio/consts';
import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank, isNotBlank } from 'in-services/util/string';
import { humioEnabled } from 'in-services/featureFlags';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  integration: getIntegrationConfiguration(integrationKey)
})(function HumioButton(props) {
  const { integration } = props;

  if (!humioEnabled || !integration || !integration.enabled) {
    return null;
  }

  const query = serializeQuery(props);
  if (isBlank(query)) {
    return null;
  }

  return (
    <Button kind="primary" icon="lib_humio" target="_blank" href={constructHumioLink(integration, props)}>
      Go to Humio
    </Button>
  );
});

function constructHumioLink(integration, props) {
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

function serializeQuery({ hostFqdn, kubernetesPodId, dockerContainerId, isWithinKubernetes }) {
  const query = {};

  if (hostFqdn) {
    query['kubernetes.host'] = hostFqdn;
  }

  if (kubernetesPodId) {
    query['kubernetes.pod_id'] = kubernetesPodId;
  }

  if (dockerContainerId && isWithinKubernetes) {
    query['kubernetes.docker_id'] = dockerContainerId;
  }

  return (
    Object.keys(query)
      .filter(key => isNotBlank(key) && query[key] != null && isNotBlank(String(query[key])))
      // Note: Technically incomplete as quotes are not escaped, though the input data should
      // never contain them (only IDs).
      .reduce((agg, key) => `${agg} "${key}"="${query[key]}"`, '')
      .trim()
  );
}
