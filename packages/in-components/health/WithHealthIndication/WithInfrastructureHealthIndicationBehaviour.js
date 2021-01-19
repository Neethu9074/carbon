/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getEntityHealthInfo from 'in-subscription/kubernetes/getEntityHealthInfo';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ snapshotId }) =>
    snapshotId
      ? {
          healthInfo: timeConfig$
            .flatMap(timeConfig =>
              getEntityHealthInfo({
                snapshotId,
                timeConfig
              })
            )
            .map(result => result.data)
            .filter(Boolean)
        }
      : {},
  function WithInfrastructureHealthIndicationBehaviour({ healthInfo, render }) {
    return render(healthInfo);
  }
);
