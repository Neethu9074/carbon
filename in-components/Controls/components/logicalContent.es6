import React from 'react';

import {
  fruchtermannReingoldLayouting$,
  vizceralLayoutingWithSubgraphs$,
  vizceralLayouting$
}  from 'in-map/stores/logical/layouterStore';
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
            tooltipText='Rearrange services using fruchtermann'
            onClick={() => setLayoutingStrategy(fruchtermannReingoldLayouting$)} />,
    <Layout key='v_layout'
            iconType='options'
            tooltipText='Rearrange services using vizceral'
            onClick={() => setLayoutingStrategy(vizceralLayouting$)} />,
    <Layout key='vsub_layout'
            iconType='menu'
            tooltipText='Rearrange services using vizceral with subgraphs'
            onClick={() => setLayoutingStrategy(vizceralLayoutingWithSubgraphs$)} />
  ];

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
