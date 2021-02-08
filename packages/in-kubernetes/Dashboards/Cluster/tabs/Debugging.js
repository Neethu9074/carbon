/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';

export default function Debugging({ cluster }) {
  const debuggingInfo =
    cluster.debuggingInfo &&
    Object.keys(cluster.debuggingInfo).map(key => ({ key, value: cluster.debuggingInfo[key] }));
  return (
    <KeyValueList
      title={t('in-kubernetes:dashboards.debuggingInformation')}
      items={debuggingInfo}
      onEmptyText={t('in-kubernetes:dashboards.noDebuggingInformation')}
    />
  );
}
