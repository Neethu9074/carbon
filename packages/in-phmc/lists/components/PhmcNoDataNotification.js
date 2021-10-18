/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function PhmcNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_phmc_console"
      title={t('in-phmc:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-phmc:noData')} />}
      {...props}
    />
  );
}
