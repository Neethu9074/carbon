/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { emptyMap } from 'in-services/fixedImmutables';
import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function JBossAsInfo({ snapshot }) {
  const serverInfo = snapshot.getIn(['data', 'serverInfo'], emptyMap);

  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.jBossAsApplicationContainer.version')}>
        {`${serverInfo.get('releaseVersion', '')} ${serverInfo.get('productName', '')}`}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jBossAsApplicationContainer.server')}>
        {serverInfo.get('serverName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jBossAsApplicationContainer.node')}>
        {serverInfo.get('nodeName')}
      </DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.jBossAsApplicationContainer.home')}>
        {serverInfo.get('homeDir')}
      </DescriptionItem>
    </DescriptionList>
  );
}
