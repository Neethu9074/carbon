import React from 'react';

import { getIntegrationConfiguration } from 'in-integrations/logging/configurationsStore';
import { luceneEscapeString, requiresQuotes } from 'in-stores/search/manipulation';
import { integrationKey } from 'in-integrations/logging/logdna/consts';
import { toParams } from 'in-stores/navigation/routing/stringifier';
import { logDnaEnabled } from 'in-services/featureFlags';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  integration: getIntegrationConfiguration(integrationKey)
})(function LogDnaButton(props) {
  const { integration } = props;

  if (!logDnaEnabled || !integration || !integration.enabled) {
    return null;
  }

  const query = serializeQuery(props);
  if (isBlank(query)) {
    return null;
  }

  return (
    <Button kind="primary" target="_blank" href={constructLink(integration, props)}>
      Go to LogDNA
    </Button>
  );
});

function constructLink(integration, props) {
  const { timeConfig } = props;
  const queryParameters = {
    q: serializeQuery(props)
  };

  if (!timeConfig.to) {
    queryParameters.t = new Date(timeConfig.to).toUTCString();
  }

  return `https://app.logdna.com/${integration.accountId}/logs/view${toParams(queryParameters, '?', '&')}`;
}

function serializeQuery({ hostFqdn }) {
  let query = '';

  if (hostFqdn) {
    if (requiresQuotes(hostFqdn)) {
      query = ` host:"${luceneEscapeString(hostFqdn)}"`;
    } else {
      query = ` host:${luceneEscapeString(hostFqdn)}`;
    }
  }

  return query.trim();
}
