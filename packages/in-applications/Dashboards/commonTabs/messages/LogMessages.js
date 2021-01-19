/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { get } from 'lodash';

import LogMessagesTable from 'in-applications/Dashboards/commonTabs/messages/components/LogMessagesTable';
import getEndpointInfo from 'in-subscription/application/getEndpointInfo';
import getServiceLabel from 'in-subscription/application/getServiceLabel';
import getApplication from 'in-subscription/application/getApplication';
import Footer from 'in-new-components/Footer/Footer';
import Card from 'in-new-components/Card';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null,
    serviceName: props.serviceId ? getServiceLabel({ id: props.serviceId }).map(getLabel) : null,
    endpointName: props.endpointId ? getEndpointInfo({ id: props.endpointId }).map(getLabel) : null
  }),
  function LogMessages({ boundaryScope: urlBoundaryScope, data: application, ...props }) {
    const boundaryScope = urlBoundaryScope || application.boundaryScope;

    return (
      <Fragment>
        <Card>
          <LogMessagesTable boundaryScope={boundaryScope} {...props} />
        </Card>
        <Footer />
      </Fragment>
    );
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
