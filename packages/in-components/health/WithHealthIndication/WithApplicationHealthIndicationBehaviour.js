/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId }) =>
    applicationId || serviceId || endpointId
      ? {
          healthInfo: timeConfig$.flatMap(timeConfig =>
            getApplicationEntityHealthInfo({
              applicationId,
              serviceId,
              endpointId,
              timeConfig
            })
              .map(result => result.data)
              .filter(Boolean)
          )
        }
      : {},
  function WithApplicationHealthIndicationBehaviour({ healthInfo, render }) {
    return render(healthInfo);
  }
);
