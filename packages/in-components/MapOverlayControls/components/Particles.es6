import React from 'react';

import { particlesAreActive$, toggleParticles } from 'in-map/stores/logical/particlesStore';
import Control from 'in-components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    particlesAreActive: particlesAreActive$
  },
  function Particles({ particlesAreActive }) {
    return (
      <Control
        onClick={toggleParticles}
        tooltipText="Show particles"
        iconSize={24}
        type="particles"
        isActive={particlesAreActive}
      />
    );
  }
);
