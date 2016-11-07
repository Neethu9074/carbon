import React from 'react';

import {fruchtermannReingoldLayouting$, vizceralLayouting$} from 'in-map/stores/logical/layouterStore';
import MapStatistics from 'in-components/Controls/components/MapStatistics';
import {setLayoutingStrategy} from 'in-map/stores/logical/layouterStore';
import {alternativeLogicalLayouting} from 'in-services/featureFlags';
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
            onClick={() => setLayoutingStrategy(fruchtermannReingoldLayouting$)} />
  ];

  if (alternativeLogicalLayouting) {
    controls.push(
      <Layout key='v_layout'
              iconType='options'
              onClick={() => setLayoutingStrategy(vizceralLayouting$)} />
    );
  }

  if (__DEV__) {
    controls.push(
      <Icons key='icons' />,
      <MapStatistics key='mapstatistics' />
    );
  }

  return controls.reverse();
}
