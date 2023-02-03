/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function OpenstackNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_openstack"
      title={t('in-openstack:noMonitoringDataFound')}
      renderExplanation={() => <ArticleContent markdownContent={t('in-openstack:noData')} />}
      {...props}
    />
  );
}
