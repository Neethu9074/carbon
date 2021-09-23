/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
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
        icon="lib_zhmcConsole"
        title={t('in-zhmc:noMonitoringData')}
        explanation={() => <ArticleContent markdownContent={t('in-zhmc:explanation')} />}
      />
    </div>
  );
}
