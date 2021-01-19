/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import EntityHealthIndicator from 'in-new-components/EntityHealthIndicator/EntityHealthIndicator';
import getEntityHealthInfo from 'in-subscription/kubernetes/getEntityHealthInfo';
import { getTimeConfigAlignedToResultTime } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ snapshotId, timeConfig }) => {
  const healthInfo$ = getEntityHealthInfo({
    snapshotId,
    timeConfig
  }).filter(healthInfo => healthInfo.data != null);

  return {
    openIssues: healthInfo$.map(result => result.data.openIssues.length),
    maxSeverity: healthInfo$.map(result => result.data.maxSeverity),
    timeConfig: healthInfo$.map(result => getTimeConfigAlignedToResultTime(timeConfig, result))
  };
}, EntityHealthIndicator);
