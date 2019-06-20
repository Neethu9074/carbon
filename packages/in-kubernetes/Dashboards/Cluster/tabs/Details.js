import React, { Fragment } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';
import Debugging from 'in-kubernetes/Dashboards/Cluster/tabs/Debugging';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo({ isInternalVisible: isInternalVisible$ }, function Details({
  isInternalVisible,
  data: cluster
}) {
  return (
    <Fragment>
      <Row>
        <Col lg={12}>
          <ComponentStatusTable cluster={cluster} />
        </Col>
      </Row>
      {isInternalVisible && (
        <Row>
          <Col lg={12}>
            <Debugging cluster={cluster} />
          </Col>
        </Row>
      )}
    </Fragment>
  );
});
