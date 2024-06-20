/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function FinagleInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.finagleApplicationContainer.version')}>
        {snapshot.getIn(['data', 'version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
