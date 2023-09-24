/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import invariant from 'invariant';

import { Col, Row } from 'in-components/layout/Grid';

interface Props {
  children: ReactNode;
}

export default function Columize({ children }: Props): JSX.Element | null {
  let childrenArray = React.Children.toArray(children);
  childrenArray = childrenArray.filter(Boolean);

  if (childrenArray.length === 0) {
    return null;
  }

  const sizePerItem = 12 / childrenArray.length;
  invariant(childrenArray.length <= 12, 'Columnize is not supported with more than 12 children');

  return (
    <Row>
      {React.Children.map(childrenArray, child => (
        <Col lg={Math.floor(sizePerItem)}>{child}</Col>
      ))}
    </Row>
  );
}
