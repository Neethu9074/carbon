/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

import locals from './NoData.mless';

export default function NoData() {
  return (
    <div className={locals.noData}>
      <EntityPageMainNotification
        icon="lib_powervc"
        title={t('in-powervc:noMonitoringDataFound')}
        explanation={() => <ArticleContent markdownContent={t('in-powervc:noData')} />}
      />
    </div>
  );
}
