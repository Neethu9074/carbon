/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/legacy';

import { constructLink } from 'in-integrations/logging/mezmo/LinkConstruction';
import { jumpToMezmo } from 'in-integrations/logging/mezmo/tracker';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function MezmoButton(props) {
  const { mezmoIntegration: integration } = props;

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <Button
      className={props.className}
      kind="secondary"
      icon="lib_mezmo"
      target="_blank"
      href={constructLink(
        getQueryParameters(props),
        integration.instanceType,
        integration.accountId,
        integration.baseUrl
      )}
      onClick={() => jumpToMezmo()}
    >
      {t('in-settings:tabs.mezmo')}
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
