import React, { Fragment } from 'react';

import DetailsNavigation, {
  labelsNavigationItem,
  annotationsNavigationItem,
  specNavigationItem
} from 'in-kubernetes/Dashboards/commonComponents/DetailsNavigation';
import { podDashboardDetailsFullyQualified } from 'in-kubernetes/navigation/paths';
import getAnnotations from 'in-kubernetes/components/getAnnotations';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ data: pod }) => ({ annotations: getAnnotations(pod.id) }), function Details({
  data: pod,
  annotations,
  timeConfig
}) {
  return (
    <Fragment>
      <DetailsNavigation
        navigationItems={navigationItems}
        resource={pod}
        annotations={annotations}
        timeConfig={timeConfig}
      />
    </Fragment>
  );
});

const navigationItems = [
  labelsNavigationItem(podDashboardDetailsFullyQualified),
  annotationsNavigationItem(`${podDashboardDetailsFullyQualified}/annotations`),
  specNavigationItem(`${podDashboardDetailsFullyQualified}/spec`)
].filter(Boolean);
