import React, { Fragment } from 'react';

import { serviceId as matrixServiceId } from 'in-kubernetes/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { timeConfig$ } from 'in-stores/time/config';
import { always } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ timeConfig: timeConfig$ }, function ServiceDashboard({ location, timeConfig }) {
  const props = {
    serviceId: getMatrixParameter(location, serviceDashboard, matrixServiceId),
    viewPath: serviceDashboard,
    timeConfig
  };

  return (
    <Fragment>
      <TabView
        result$={always({
          progress: { loading: false },
          errors: [],
          data: {
            id: props.serviceId,
            label: `Service ${props.serviceId}`
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
});

function Header(props) {
  return <BasicDashboardHeader title="Service" icon="lib_application_service" {...props} />;
}
