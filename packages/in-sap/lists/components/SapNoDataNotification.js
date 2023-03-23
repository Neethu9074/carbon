/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function SapNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_sap"
      title={t('in-sap:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-sap:noData')} />}
      {...props}
    />
  );
}
