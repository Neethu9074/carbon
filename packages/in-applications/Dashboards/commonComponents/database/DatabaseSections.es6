import React, { Fragment } from 'react';

import DatabaseStatementTopList from 'in-applications/Dashboards/commonComponents/database/DatabaseStatementTopList';
import getEndpointTypes from 'in-subscription/application/getEndpointTypes';
import { Row, Col } from 'in-new-components/layout/Grid';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    types: getEndpointTypes({
      filter: {
        application: props.applicationId,
        service: props.serviceId,
        endpoint: props.endpointId,
        timeframe: props.timeframe
      }
    }).map(result => result.data || null)
  }),
  function DatabaseSections(props) {
    if (!hasDatabaseEndpoints(props.types)) {
      return null;
    }

    return (
      <Fragment>
        <Row>
          <Col lg={12}>
            <DatabaseStatementTopList {...props} />
          </Col>
        </Row>
      </Fragment>
    );
  }
);

function hasDatabaseEndpoints(types) {
  if (!types) {
    return false;
  }
  return hasType('DATABASE', types);
}

function hasType(type, types) {
  return types.indexOf(type) >= 0;
}
