/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import KeyValueList from 'in-kubernetes/Dashboards/commonComponents/KeyValueList';

export default function Debugging({ cluster }) {
  const debuggingInfo =
    cluster.debuggingInfo &&
    Object.keys(cluster.debuggingInfo).map(key => ({ key, value: cluster.debuggingInfo[key] }));
  return <KeyValueList title="Debugging Information" items={debuggingInfo} onEmptyText={'No debugging information'} />;
}
