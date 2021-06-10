/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityVersionListing from 'in-new-components/EntityVersionList/EntityVersionListing';
import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification';
import { t } from 'in-i18n';

export default function EntityVersionListPresenter({ plugin, versions }) {
  return (
    <EntityPageMainNotification framed plugin={plugin} explanation={t('in-components:entityVersionList.explanation')}>
      <EntityVersionListing versions={versions} />
    </EntityPageMainNotification>
  );
}
