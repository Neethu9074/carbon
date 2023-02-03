/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Axis, { VerticalAxisProps } from 'in-components/Axis';

export const HEIGHT = 300;

interface Props extends Omit<VerticalAxisProps, 'renderTickLines' | 'isVertical' | 'height'> {
  height?: number;
}

export default function VerticalAxis(props: Props) {
  const { height = HEIGHT, align = 'left' } = props;
  return <Axis {...props} align={align} isVertical height={height} renderTickLines={false} />;
}
