import React from 'react';

import MapStatistics from 'in-components/Controls/components/MapStatistics';
import Metrics from 'in-components/Controls/components/Metrics';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';
import Tags from 'in-components/Controls/components/Tags';


export default function getPhysicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <Metrics key='metrics' />,
    <Tags key='tags' />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
