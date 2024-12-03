/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem, SvgIcon } from '@instana/components';

import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank } from 'in-services/util/string';

export default function CoralogixButton(props) {
  const { coralogixIntegration: integration } = props;
  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }
  return (
    <CarbonMenuItem
      renderIcon={() => {
        return <SvgIcon type="lib_coralogix" />;
      }}
      onClick={() => window.open(constructCoralogixLink(integration, props), '_blank')}
      label="Coralogix"
    />
  );
}

function constructCoralogixLink(integration, props) {
  const { timeConfig } = props;
  const queryParameters = {
    query: serializeHosts(props)
  };
  if (timeConfig.to) {
    if (timeConfig.windowSize) {
      queryParameters.startTime = timeConfig.to - timeConfig.windowSize;
    }
    queryParameters.endTime = timeConfig.to;
  } else {
    if (timeConfig.windowSize) {
      queryParameters.startTime = Date.now() - timeConfig.windowSize;
    }
  }
  return `${integration.url}/#/query/logs${toParams(queryParameters, '?', '&')}`;
}

export function serializeHosts({ hostName, hostFqdn }) {
  let query = [];

  if (hostName) {
    query.push(`host:"${hostName}"`);
    query.push(`hostname:"${hostName}"`);
  }
  if (hostFqdn) {
    query.push(`host:"${hostFqdn}"`);
    query.push(`hostname:"${hostFqdn}"`);
  }

  return query.join(' OR ').trim();
}

export function shouldShowButton(props) {
  const query = serializeHosts(props);
  return !isBlank(query);
}
