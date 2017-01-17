import React from 'react';

import {setLayoutingStrategy, simpleLayouting$, packedLayouting$}  from 'in-map/stores/physical/layouterStore';
import ShowAggregates from 'in-components/Controls/components/ShowAggregates';
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
    <ShowAggregates key='aggregates' />,
    <Tags key='tags' />,
    <Layout key='packed_layout'
            iconType='packed_layouting'
            tooltipText='Rearrange zones as a compact structure'
            setLayoutingStrategy={setLayoutingStrategy}
            layoutingStrategy={packedLayouting$} />,
    <Layout key='simple_layout'
            iconType='options'
            tooltipText='Rearrange zones by name'
            setLayoutingStrategy={setLayoutingStrategy}
            layoutingStrategy={simpleLayouting$} />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
