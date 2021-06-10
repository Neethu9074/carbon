/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Axis from 'in-components/Axis';

export const HEIGHT = 35;

export default function HorizontalAxis(props) {
  const { width = 300, align = 'bottom' } = props;
  return <Axis isVertical={false} height={HEIGHT} align={align} width={width} {...props} tickLength={8} />;
}
