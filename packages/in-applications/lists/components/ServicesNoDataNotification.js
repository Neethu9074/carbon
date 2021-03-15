/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';
import { applicationPlugins } from 'in-forge/constants';
import { t } from 'in-i18n';

export default function ServicesNoDataNotification() {
  return (
    <EntityPageMainNotification
      plugin={applicationPlugins.service}
      title={t('in-applications:list.titleNoService')}
      explanation={() => <ArticleContent markdownContent={t('in-applications:list.servicesNoData')} />}
    />
  );
}
