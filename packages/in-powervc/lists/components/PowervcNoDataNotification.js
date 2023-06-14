/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function PowervcNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_powervc"
      title={t('in-powervc:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-powervc:noData')} />}
      {...props}
    />
  );
}
