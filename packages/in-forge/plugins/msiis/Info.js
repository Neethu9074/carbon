/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { t } from 'in-i18n';

export default function IISInfo({ snapshot }) {
  return (
    <DescriptionList>
      <DescriptionItem title={t('in-forge:plugins.msiis.version')}>
        {snapshot.getIn(['data', 'iis.version'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
