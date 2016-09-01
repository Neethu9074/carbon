import React from 'react';

import {particlesAreActive$, toggleParticles} from 'in-map/stores/logical/particlesStore';
import Control from 'in-components/Controls/components/Control';
import connectTo from 'in-hoc/connectTo';


const block = 'in-particles-button';

export default connectTo({
    particlesAreActive: particlesAreActive$
  },
function Particles({particlesAreActive}) {
  let classes = block;
  if (!particlesAreActive) {
    classes += ' ' + classes + '--inactive';
  }

  return (
    <Control onClick={toggleParticles}
             tooltipText='Show particles'
             iconSize={24}
             type='particles'
             isActive={particlesAreActive} />
  );
});
