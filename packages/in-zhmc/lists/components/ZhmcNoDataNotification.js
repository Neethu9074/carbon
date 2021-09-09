/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function ZhmcNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_zhmcConsole"
      title={t('in-zhmc:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-zhmc:noData')} />}
      {...props}
    />
  );
}
