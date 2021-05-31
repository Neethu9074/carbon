/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionItem, DescriptionList } from '../../../in-sdk/components/sidebar/DescriptionList';
import { t } from '../../../in-i18n';

export default function IbmDb2Info({ snapshot }) {
  const data = snapshot.get('data');
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.ibmIDb2.sidebar.collectionServicesRunning')}>
        {data.get('collectionServicesRunning') === true ? 'RUNNING' : 'STOPPED'}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.ibmIDb2.sidebar.collectionLibraryName')}>
        {data.get('collectionLibraryName')}
      </DescriptionItem>
    </DescriptionList>
  );
}
