/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { Row, Col } from 'in-new-components/layout/Grid';

// We currently do not have any deprecations - nice! :)
export const presenterMapping = {};

export default function DeprecationsPresenter(props) {
  const { result } = props;
  if (!result || !result.data) {
    return null;
  }

  return (
    <Fragment>
      {result.data
        .filter(code => presenterMapping[code])
        .sort()
        .map(code => {
          const Component = presenterMapping[code];
          return (
            <Row key={code}>
              <Col lg={12} key={code}>
                <Component {...props} />
              </Col>
            </Row>
          );
        })}
    </Fragment>
  );
}
