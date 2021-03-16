/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Axis from 'in-new-components/Axis';

export const HEIGHT = 300;

export default function VerticalAxis(props) {
  const { height = HEIGHT, align = 'left' } = props;
  return <Axis align={align} isVertical height={height} {...props} renderTickLines={false} />;
}
