/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem, SvgIcon } from '@instana/components';

import { toParams } from 'in-stores/navigation/routing/stringifier';
import { isBlank, isNotBlank } from 'in-services/util/string';

export default function SplunkButton(props) {
  const { splunkIntegration: integration } = props;

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <CarbonMenuItem
      label="Splunk"
      renderIcon={() => {
        return <SvgIcon type="lib_splunk" />;
      }}
      onClick={() => window.open(constructSplunkLink(integration, props), '_blank')}
    />
  );
}

function constructSplunkLink(integration, props) {
  const queryParameters = {
    q: serializeQuery(props, integration.index)
  };

  // divide by 1000 to have time in seconds
  const { timeConfig } = props;
  if (timeConfig.to) {
    queryParameters.earliest = (timeConfig.to - timeConfig.windowSize) / 1000;
    queryParameters.latest = timeConfig.to / 1000;
  } else {
    queryParameters.earliest = (Date.now() - timeConfig.windowSize) / 1000;
    queryParameters.latest = 'now';
  }

  return `${integration.url}/en-US/app/search/search${toParams(queryParameters, '?', '&')}`;
}

function serializeQuery({ hostFqdn, hostName, kubernetesPodName, dockerContainerId, isWithinKubernetes }, index) {
  const query = {};

  if (index) {
    query['index'] = index;
  }

  if (kubernetesPodName) {
    query['kubernetes.pod_name'] = kubernetesPodName;
  } else if (dockerContainerId) {
    query['docker.container_id'] = dockerContainerId;
  } else if (hostFqdn || hostName) {
    const hostParam = `*${hostName ? hostName : hostFqdn}*`;
    if (isWithinKubernetes) {
      query['kubernetes.host'] = hostParam;
    } else {
      query['host'] = hostParam;
    }
  }

  return Object.keys(query)
    .filter(key => isNotBlank(key) && query[key] != null && isNotBlank(String(query[key])))
    .reduce((agg, key) => `${agg} ${key}="${query[key]}"`, '')
    .trim();
}
export function shouldShowButton(props) {
  const query = serializeQuery(props);
  return !isBlank(query);
}
