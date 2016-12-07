import React from 'react';

import {fruchtermannReingoldLayouting$, vizceralLayouting$}  from 'in-map/stores/logical/layouterStore';
import MapStatistics from 'in-components/Controls/components/MapStatistics';
import {setLayoutingStrategy} from 'in-map/stores/logical/layouterStore';
import Particles from 'in-components/Controls/components/Particles';
import Layout from 'in-components/Controls/components/Layout';
import Icons from 'in-components/Controls/components/Icons';
import Zoom from 'in-components/Controls/components/Zoom';

export default function getLogicalContent() {
  const controls = [
    <Zoom key='zoom' />,
    <Particles key='particles' />,
    <Layout key='fr_layout'
            iconType='graph'
            tooltipText='Rearrange services'
            onClick={() => setLayoutingStrategy(fruchtermannReingoldLayouting$)} />,
    <Layout key='v_layout'
            iconType='flow'
            tooltipText='Rearrange services as a flow'
            onClick={() => setLayoutingStrategy(vizceralLayouting$)} />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
