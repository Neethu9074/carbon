/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAPIVersion')}>
        {data.get('info.api_version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAppSSHEndpoint')}>
        {data.get('info.app_ssh_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAppSSHEndpoint')}>
        {data.get('info.app_ssh_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAppSSHFingerprint')}>
        {data.get('info.app_ssh_host_key_fingerprint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAppOauthClient')}>
        {data.get('info.app_ssh_oauth_client')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAuthEndpoint')}>
        {data.get('info.auth_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoDopplerLoggingEndpoint')}>
        {data.get('info.doppler_logging_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoLoggingEndpoint')}>
        {data.get('info.logging_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoRoutingEndpoint')}>
        {data.get('info.routing_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoSupport')}>
        {data.get('info.support')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoTokenEndpoint')}>
        {data.get('info.token_endpoint')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoUser')}>{data.get('info.user')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoVersion')}>
        {data.get('info.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoBuildNumber')}>
        {data.get('info.build_number')}
      </DescriptionItem>
    </DescriptionList>
  );
}
