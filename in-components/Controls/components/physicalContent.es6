import React from 'react';

import {setLayoutingStrategy, simpleLayouting$, packedLayouting$}  from 'in-map/stores/physical/layouterStore';
import MapStatistics from 'in-components/Controls/components/MapStatistics';
import Metrics from 'in-components/Controls/components/Metrics';
import Layout from 'in-components/Controls/components/Layout';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';
import Tags from 'in-components/Controls/components/Tags';


export default function getPhysicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <Metrics key='metrics' />,
    <Tags key='tags' />,
    <Layout key='simple_layout'
            iconType='options'
            tooltipText='Rearrange zones by name'
            onClick={() => setLayoutingStrategy(simpleLayouting$)} />,
    <Layout key='packed_layout'
            iconType='packed_layouting'
            tooltipText='Rearrange zones as a compact structure'
            onClick={() => setLayoutingStrategy(packedLayouting$)} />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
