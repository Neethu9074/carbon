/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function CouchbaseInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.couchbaseNode.infoHostname')}>
        {data.get('node.hostname')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.couchbaseNode.infoVersion')}>
        {data.get('node.version')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.couchbaseNode.infoStatus')}>
        {data.get('node.status')}
      </DescriptionItem>
    </DescriptionList>
  );
}
