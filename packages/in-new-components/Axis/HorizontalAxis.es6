import React from 'react';

import Axis from 'in-new-components/Axis';

export default function HorizontalAxis(props) {
  const { width = 300, align = 'bottom' } = props;
  return <Axis isVertical={false} height={30} align={align} width={width} {...props} />;
}
