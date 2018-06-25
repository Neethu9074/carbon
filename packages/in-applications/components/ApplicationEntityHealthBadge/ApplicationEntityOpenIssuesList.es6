import { fromJS } from 'immutable';
import React from 'react';

import getApplicationEntityHealthInfo from 'in-subscription/application/getApplicationEntityHealthInfo';
import EventListingPresenter from 'in-components/EventListing/EventListingPresenter';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  ({ applicationId, serviceId, endpointId }) => ({
    healthInfo: timeConfig$
      .flatMap(timeConfig =>
        getApplicationEntityHealthInfo({
          applicationId,
          serviceId,
          endpointId,
          timeConfig
        })
      )
      .filter(healthInfo => healthInfo.data != null)
      .map(healthInfo => healthInfo.data)
  }),
  function ApplicationEntityOpenIssuesList({ healthInfo }) {
    if (!healthInfo) {
      return null;
    }

    return <EventListingPresenter events={fromJS(healthInfo.openIssues)} />;
  }
);
