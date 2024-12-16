/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import EntityCveIndicator from 'in-components/EntityCveIndicator/EntityCveIndicator';
import getCveInfo from 'in-kubernetes/subscriptions/getCveInfo';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ snapshotId, timeConfig }) => {
  const healthInfo$ = getCveInfo({
    snapshotId,
    timeConfig
  }).filter(healthInfo => healthInfo.data != null);

  return {
    openIssues: healthInfo$.map(result => result.data.openIssues.length),
    maxSeverity: healthInfo$.map(result => result.data.maxSeverity)
  };
}, EntityCveIndicator);
