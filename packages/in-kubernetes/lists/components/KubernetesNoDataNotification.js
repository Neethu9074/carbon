/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function KubernetesNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_kubernetes"
      title={t('in-kubernetes:noMonitoringDataFound')}
      explanation={() => <ArticleContent markdownContent={t('in-kubernetes:kubernetes.noData')} />}
      {...props}
    />
  );
}
