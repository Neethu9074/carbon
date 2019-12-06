import { get } from 'lodash';
import React, { Fragment } from 'react';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import ErrorMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/ErrorMessagesTable';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null,
    endpointName: props.endpointId ? getEndpointInfo({ id: props.endpointId }).map(getLabel) : null
  }),
  function ErrorMessages({ boundaryScope, onBoundaryStateChange, defaultBoundaryScope, ...props }) {
    return (
      <Fragment>
        <InboundOrAllCallsChoiceHorizontal
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          defaultBoundaryScope={defaultBoundaryScope}
        />
        <ErrorMessagesTable boundaryScope={boundaryScope} {...props} />
      </Fragment>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
