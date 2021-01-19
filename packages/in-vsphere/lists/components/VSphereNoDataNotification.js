/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';

export default function VSphereNoDataNotification(props) {
  return (
    <EntityPageMainNotification
      icon="lib_vsphere"
      title="No Monitoring Data Found"
      renderExplanation={() => <ArticleContent id="vsphereNoData" />}
      {...props}
    />
  );
}
