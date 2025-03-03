/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonMenuItem, SvgIcon } from '@instana/components';

import { integrationKey as mezmoIntegrationKey } from 'in-integrations/logging/mezmo/consts';
import { constructLink } from 'in-integrations/logging/mezmo/LinkConstruction';
import { useJumpToThirdParty } from 'in-integrations/logging/tracking';
import { isBlank } from 'in-services/util/string';
import { t } from 'in-i18n';

export default function MezmoButton(props) {
  const { mezmoIntegration: integration } = props;
  const jumpToThirdParty = useJumpToThirdParty();

  if (!shouldShowButton(props) || !integration || !integration.enabled) {
    return null;
  }

  return (
    <CarbonMenuItem
      label={t('in-settings:tabs.mezmo')}
      renderIcon={() => {
        return <SvgIcon type="lib_mezmo" />;
      }}
      onClick={() => {
        window.open(
          constructLink(
            getQueryParameters(props),
            integration.instanceType,
            integration.accountId,
            integration.baseUrl
          ),
          '_blank'
        );
        jumpToThirdParty(mezmoIntegrationKey);
      }}
    />
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
