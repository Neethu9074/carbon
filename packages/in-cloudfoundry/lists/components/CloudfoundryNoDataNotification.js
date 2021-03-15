/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';
import { t } from 'in-i18n';

export default function CloudfoundryNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_cloudfoundry"
      title={t('in-cloudfoundry:noMonitoringDataFound')}
      explanation={() => <ArticleContent markdownContent={t('in-cloudfoundry:cloudfoundry.noData')} />}
      {...props}
    />
  );
}
