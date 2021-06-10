/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function VSphereNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_vsphere"
      title={t('in-vsphere:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-vsphere:noData')} />}
      {...props}
    />
  );
}
