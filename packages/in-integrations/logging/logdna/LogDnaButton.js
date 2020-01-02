import React from 'react';

import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { integrationKey } from 'in-integrations/logging/logdna/consts';
import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  integration: getIntegrationConfiguration(integrationKey)
})(function LogDnaButton(props) {
  const { integration } = props;

  if (!integration || !integration.enabled) {
    return null;
  }

  if (!shouldShowButton(props)) {
    return null;
  }

  return (
    <Button
      className={props.className}
      kind="secondary"
      icon="lib_logdna"
      target="_blank"
      href={constructLink(integration, props)}
    >
      Go to LogDNA
    </Button>
  );
});

function constructLink(integration, props) {
  const { timeConfig } = props;
  const queryParameters = {
    hosts: serializeHosts(props)
  };

  if (timeConfig.to) {
    queryParameters.t = new Date(timeConfig.to).toISOString();
  }

  return `https://app.logdna.com/${integration.accountId}/logs/view${toParams(queryParameters, '?', '&')}`;
}

function serializeHosts({ hostFqdn }) {
  let query = '';

  if (hostFqdn) {
    query = hostFqdn;
  }

  return query.trim();
}

export function shouldShowButton(props) {
  const query = serializeHosts(props);
  return !isBlank(query);
}
