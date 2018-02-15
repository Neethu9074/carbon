import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { servicesList } from 'in-applications/navigation/paths';
import getService from 'in-subscription/application/getService';
import { getView } from 'in-stores/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    service: getService({
      id: props.serviceId,
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    })
  }),
  function ApplicationServiceViewBreadcrumb({ service }) {
    if (service.progress.loading || service.errors.length > 0) {
      return <Breadcrumb href$={getView(servicesList)}>Services</Breadcrumb>;
    } else {
      return <Breadcrumb href$={getView(servicesList)}>Services ({service.data.label})</Breadcrumb>;
    }
  }
);
