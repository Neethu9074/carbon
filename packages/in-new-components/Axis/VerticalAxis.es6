import React from 'react';

import Axis from 'in-new-components/Axis';

export const WIDTH = 60;
export const HEIGHT = 300;

export default function VerticalAxis(props) {
  const { height = HEIGHT, align = 'left' } = props;
  return <Axis align={align} isVertical height={height} width={WIDTH} {...props} renderTickLines={false} />;
}
