/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank } from 'in-services/util/string';
import Button from 'in-new-components/Button';

export default function LogDnaButton(props) {
  const { logdnaIntegration: integration } = props;

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
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
      LogDNA
    </Button>
  );
}

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
