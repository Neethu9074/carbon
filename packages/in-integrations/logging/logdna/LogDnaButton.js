/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import { constructLink } from 'in-integrations/logging/logdna/LinkConstruction';
import { jumpToLogDna } from 'in-integrations/logging/logdna/tracker';
import { isBlank } from 'in-services/util/string';

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
      href={constructLink(
        getQueryParameters(props),
        integration.instanceType,
        integration.accountId,
        integration.baseUrl
      )}
      onClick={() => jumpToLogDna()}
    >
      LogDNA
    </Button>
  );
}

export function getQueryParameters(props) {
  const { timeConfig } = props;
  const queryParameters = {
    hosts: serializeHosts(props)
  };

  if (timeConfig.to) {
    queryParameters.t = new Date(timeConfig.to).toISOString();
  }
  return queryParameters;
}

function serializeHosts({ hostName, hostFqdn }) {
  let query = '';

  if (hostName) {
    query = hostName;
  }
  if (!isBlank(hostFqdn)) {
    query += ',' + hostFqdn;
  }

  return query.trim();
}

export function shouldShowButton(props) {
  const query = serializeHosts(props);
  return !isBlank(query);
}
