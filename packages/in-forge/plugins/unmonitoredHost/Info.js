/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.ipv4')}>{data.get('ipv4')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.infoTitle.reverseLookup')}>{data.get('dnsName')}</DescriptionItem>
    </DescriptionList>
  );
}
