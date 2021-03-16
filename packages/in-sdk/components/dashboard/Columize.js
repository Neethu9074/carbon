/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import invariant from 'invariant';
import React from 'react';

import { Col, Row } from 'in-new-components/layout/Grid';

export default function Columize({ children }) {
  children = React.Children.toArray(children);
  children = children.filter(Boolean);

  if (children.length === 0) {
    return null;
  }

  const sizePerItem = 12 / children.length;
  invariant(children.length <= 12, 'Columnize is not supported with more than 12 children');

  return (
    <Row>
      {React.Children.map(children, child => (
        <Col lg={Math.floor(sizePerItem)}>{child}</Col>
      ))}
    </Row>
  );
}
