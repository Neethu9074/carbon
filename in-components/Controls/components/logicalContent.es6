import React from 'react';

import {setLayoutingStrategy, fruchtermannReingoldLayouting$, vizceralLayouting$}  from 'in-map/stores/logical/layouterStore';
import ShowAggregates from 'in-components/Controls/components/ShowAggregates';
import MapStatistics from 'in-components/Controls/components/MapStatistics';
import Particles from 'in-components/Controls/components/Particles';
import Layout from 'in-components/Controls/components/Layout';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';

export default function getLogicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <ShowAggregates key='aggregates' />,
    <Particles key='particles' />,
    <Layout key='fr_layout'
            iconType='graph'
            tooltipText='Rearrange services'
            setLayoutingStrategy={setLayoutingStrategy}
            layoutingStrategy={fruchtermannReingoldLayouting$} />,
    <Layout key='v_layout'
            iconType='flow'
            tooltipText='Rearrange services as a flow'
            setLayoutingStrategy={setLayoutingStrategy}
            layoutingStrategy={vizceralLayouting$} />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
