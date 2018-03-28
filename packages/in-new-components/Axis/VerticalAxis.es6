import React from 'react';

import Axis from 'in-new-components/Axis';

export default function VerticalAxis(props) {
  const { height = 300, align = 'left' } = props;
  return <Axis align={align} isVertical height={height} width={30} {...props} />;
}
