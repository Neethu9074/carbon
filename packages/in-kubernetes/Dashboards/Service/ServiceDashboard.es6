import React, { Fragment } from 'react';

import KubernetesIndicator from 'in-kubernetes/Dashboards/commonComponents/KubernetesIndicator';
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
import { serviceId as matrixServiceId } from 'in-kubernetes/navigation/matrix';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import TabView from 'in-new-components/LocationAwareTabView/TabView';
import { serviceDashboard } from 'in-kubernetes/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import tabs from 'in-kubernetes/Dashboards/Service/tabs/index';
import { getTimeConfig } from 'in-stores/time/config';
import { always } from 'in-services/fixedStreams';

export default function ServiceDashboard({ location }) {
  const props = {
    serviceId: getMatrixParameter(location, serviceDashboard, matrixServiceId),
    viewPath: serviceDashboard,
    timeConfig: getTimeConfig(location)
  };

  return (
    <Fragment>
      <TabView
        result$={always({
          progress: { loading: false },
          errors: [],
          data: {
            id: props.serviceId,
            label: props.serviceId
          }
        })}
        HeaderComponent={Header}
        location={location}
        tabs={tabs}
        props={props}
      />
    </Fragment>
  );
}

function Header(props) {
  return <BasicDashboardHeader title="Service" icon="lib_kubernetes_service" {...props} renderSubTypes={SubTypes} />;
}

function SubTypes() {
  return (
    <Fragment>
      <TypesBadgeList type="K8s Service" />
      <KubernetesIndicator />
    </Fragment>
  );
}
