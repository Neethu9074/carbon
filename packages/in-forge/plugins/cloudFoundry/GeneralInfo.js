/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoID')}>{data.get('id')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoOrganization')}>{data.get('org')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoSpace')}>{data.get('space')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.cloudFoundry.infoAPIEndpoint')}>
        {data.get('api_endpoint')}
      </DescriptionItem>
    </DescriptionList>
  );
}
