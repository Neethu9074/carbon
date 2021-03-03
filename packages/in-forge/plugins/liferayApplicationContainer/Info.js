/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';

export default function LiferayInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.liferayApplicationContainer.version', 'Version')}>
        {snapshot.getIn(['data', 'version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
