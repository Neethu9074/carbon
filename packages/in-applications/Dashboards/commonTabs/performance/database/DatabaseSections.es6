import React, { Fragment } from 'react';

import DatabaseStatementTopList from './DatabaseStatementTopList';
import { Row, Col } from 'in-new-components/layout/Grid';

export default function DatabaseSections(props) {
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
