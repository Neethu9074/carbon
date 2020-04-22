import React, { Fragment } from 'react';
import { get } from 'lodash';

import InboundOrAllCallsChoiceHorizontal from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceHorizontal';
import ErrorMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/ErrorMessagesTable';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import Footer from 'in-new-components/Footer/Footer';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null,
    endpointName: props.endpointId ? getEndpointInfo({ id: props.endpointId }).map(getLabel) : null
  }),
  function ErrorMessages({ onBoundaryStateChange, boundaryScope: urlBoundaryScope, data: application, ...props }) {
    const boundaryScope = urlBoundaryScope || application.boundaryScope;

    return (
      <Fragment>
        <InboundOrAllCallsChoiceHorizontal
          boundaryScope={boundaryScope}
          onBoundaryStateChange={onBoundaryStateChange}
          defaultBoundaryScope={application.boundaryScope}
        />
        <ErrorMessagesTable boundaryScope={boundaryScope} {...props} />
        <Footer />
      </Fragment>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
